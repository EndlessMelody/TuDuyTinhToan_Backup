/**
 * useVoiceRoom — Discord-style Voice Chat with WebRTC
 *
 * Implements peer-to-peer audio using WebRTC with WebSocket signaling.
 * Mesh network: each peer connects to every other peer in the room.
 *
 * Usage:
 *   const { isConnected, isMuted, speakingUsers, connect, disconnect, toggleMute, remoteStreams } = useVoiceRoom(roomId, userId, token);
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface VoiceRoomState {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  localStream: MediaStream | null;
  error: string | null;
  speakingUsers: Set<number>;
  mutedUsers: Set<number>;
  remoteStreams: Map<number, MediaStream>;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
}

export function useVoiceRoom(
  roomId: string | number,
  userId: number,
  token: string,
): VoiceRoomState {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // Default voice state on join: muted + deafened until user opts in.
  const [isMuted, setIsMuted] = useState(true);
  const [isDeafened, setIsDeafened] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speakingUsers, setSpeakingUsers] = useState<Set<number>>(new Set());
  const [mutedUsers, setMutedUsers] = useState<Set<number>>(new Set());
  const [remoteStreams, setRemoteStreams] = useState<Map<number, MediaStream>>(
    new Map(),
  );

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
  const remoteAudioElsRef = useRef<Map<number, HTMLAudioElement>>(new Map());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const speakingTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const attachRemoteAudio = useCallback(
    (remoteUserId: number, remoteStream: MediaStream) => {
      let audioEl = remoteAudioElsRef.current.get(remoteUserId);
      if (!audioEl) {
        audioEl = new Audio();
        audioEl.autoplay = true;
        audioEl.preload = "auto";
        audioEl.setAttribute("playsinline", "true");
        remoteAudioElsRef.current.set(remoteUserId, audioEl);
      }

      if (audioEl.srcObject !== remoteStream) {
        audioEl.srcObject = remoteStream;
      }

      audioEl.muted = isDeafened;
      audioEl.volume = 1;

      const playPromise = audioEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Playback can fail before the browser grants media playback permissions.
        });
      }
    },
    [isDeafened],
  );

  const cleanupRemoteAudio = useCallback((remoteUserId: number) => {
    const audioEl = remoteAudioElsRef.current.get(remoteUserId);
    if (!audioEl) return;
    audioEl.pause();
    audioEl.srcObject = null;
    remoteAudioElsRef.current.delete(remoteUserId);
  }, []);

  // ── Voice activity detection (VAD) on local mic ──────────────────────────
  const startVAD = useCallback(
    (stream: MediaStream) => {
      try {
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;

        const buf = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(buf);
          const avg = buf.reduce((a, b) => a + b, 0) / buf.length;

          // Send speaking state via WebSocket
          const isSpeaking = avg > 12;
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: "speaking",
                payload: { is_speaking: isSpeaking },
              }),
            );
          }

          // Local speaking indicator
          setSpeakingUsers((prev) => {
            const next = new Set(prev);
            if (isSpeaking) next.add(userId);
            else next.delete(userId);
            return next;
          });

          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        // AudioContext may not be available in all environments — ignore silently
      }
    },
    [userId],
  );

  // ── Create RTCPeerConnection for a remote user ──────────────────────────
  const createPeerConnection = useCallback(
    async (remoteUserId: number): Promise<RTCPeerConnection> => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      // Handle incoming tracks
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (remoteStream) {
          setRemoteStreams((prev) =>
            new Map(prev).set(remoteUserId, remoteStream),
          );
          attachRemoteAudio(remoteUserId, remoteStream);
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "signal",
              payload: {
                target_user_id: remoteUserId,
                signal_type: "ice_candidate",
                data: event.candidate,
              },
            }),
          );
        }
      };

      // Add local stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, streamRef.current!);
        });
      }

      peerConnectionsRef.current.set(remoteUserId, pc);
      return pc;
    },
    [attachRemoteAudio],
  );

  // ── Handle incoming WebSocket messages ────────────────────────────────
  const handleWebSocketMessage = useCallback(
    async (message: { type: string; payload: Record<string, unknown> }) => {
      const { type, payload } = message;

      switch (type) {
        case "voice_participants":
          // New participants joined - initiate connection to each
          const participants: number[] =
            (payload.participants as number[]) || [];
          for (const remoteUserId of participants) {
            if (!peerConnectionsRef.current.has(remoteUserId)) {
              const pc = await createPeerConnection(remoteUserId);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);

              wsRef.current?.send(
                JSON.stringify({
                  type: "signal",
                  payload: {
                    target_user_id: remoteUserId,
                    signal_type: "offer",
                    data: offer,
                  },
                }),
              );
            }
          }
          break;

        case "user_joined_voice":
          // New user joined - initiate connection
          const newUserId = payload.user_id as number;
          if (!peerConnectionsRef.current.has(newUserId)) {
            const pc = await createPeerConnection(newUserId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            wsRef.current?.send(
              JSON.stringify({
                type: "signal",
                payload: {
                  target_user_id: newUserId,
                  signal_type: "offer",
                  data: offer,
                },
              }),
            );
          }
          break;

        case "user_left_voice":
          // User left - cleanup connection
          const leftUserId = payload.user_id as number;
          const pc = peerConnectionsRef.current.get(leftUserId);
          if (pc) {
            pc.close();
            peerConnectionsRef.current.delete(leftUserId);
          }
          setRemoteStreams((prev) => {
            const next = new Map(prev);
            next.delete(leftUserId);
            return next;
          });
          cleanupRemoteAudio(leftUserId);
          setSpeakingUsers((prev) => {
            const next = new Set(prev);
            next.delete(leftUserId);
            return next;
          });
          setMutedUsers((prev) => {
            const next = new Set(prev);
            next.delete(leftUserId);
            return next;
          });
          break;

        case "signal":
          // WebRTC signaling
          const { from_user_id, signal_type, data } = payload as {
            from_user_id: number;
            signal_type: string;
            data: RTCSessionDescriptionInit;
          };
          const remotePc = peerConnectionsRef.current.get(from_user_id);

          if (!remotePc) {
            // Create connection if it doesn't exist
            const pc = await createPeerConnection(from_user_id);
            if (signal_type === "offer") {
              await pc.setRemoteDescription(
                new RTCSessionDescription(data as RTCSessionDescriptionInit),
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              wsRef.current?.send(
                JSON.stringify({
                  type: "signal",
                  payload: {
                    target_user_id: from_user_id,
                    signal_type: "answer",
                    data: answer,
                  },
                }),
              );
            }
          } else {
            if (signal_type === "offer") {
              await remotePc.setRemoteDescription(
                new RTCSessionDescription(data),
              );
              const answer = await remotePc.createAnswer();
              await remotePc.setLocalDescription(answer);

              wsRef.current?.send(
                JSON.stringify({
                  type: "signal",
                  payload: {
                    target_user_id: from_user_id,
                    signal_type: "answer",
                    data: answer,
                  },
                }),
              );
            } else if (signal_type === "answer") {
              await remotePc.setRemoteDescription(
                new RTCSessionDescription(data as RTCSessionDescriptionInit),
              );
            } else if (signal_type === "ice_candidate") {
              await remotePc.addIceCandidate(
                new RTCIceCandidate(data as RTCLocalIceCandidateInit),
              );
            }
          }
          break;

        case "mute_toggle":
          // Update mute state for remote user
          const muteUserId = payload.user_id as number;
          setMutedUsers((prev) => {
            const next = new Set(prev);
            if (payload.is_muted as boolean) next.add(muteUserId);
            else next.delete(muteUserId);
            return next;
          });
          setSpeakingUsers((prev) => {
            const next = new Set(prev);
            if (payload.is_muted as boolean) {
              next.delete(muteUserId);
            }
            return next;
          });
          break;

        case "speaking":
          // Update speaking state for remote user
          const speakUserId = payload.user_id as number;
          setSpeakingUsers((prev) => {
            const next = new Set(prev);
            if (payload.is_speaking as boolean) {
              next.add(speakUserId);
              // Clear existing timeout
              const existingTimeout =
                speakingTimeoutRef.current.get(speakUserId);
              if (existingTimeout) clearTimeout(existingTimeout);

              // Set timeout to remove speaking status after silence
              speakingTimeoutRef.current.set(
                speakUserId,
                setTimeout(() => {
                  next.delete(speakUserId);
                  setSpeakingUsers(new Set(next));
                }, 500),
              );
            } else {
              next.delete(speakUserId);
            }
            return next;
          });
          break;
      }
    },
    [createPeerConnection, cleanupRemoteAudio],
  );

  // ── Connect ───────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    setError(null);

    if (!token) {
      setError("Missing auth token for voice connection");
      setIsConnecting(false);
      return;
    }

    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;
      setLocalStream(stream);
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      startVAD(stream);

      // Connect to WebSocket signaling server
      const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") || "ws://localhost:8000"}/api/v1/groups/${roomId}/voice?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setMutedUsers((prev) => {
          const next = new Set(prev);
          if (isMuted) next.add(userId);
          else next.delete(userId);
          return next;
        });

        // Broadcast initial local mute state so others render status correctly.
        ws.send(
          JSON.stringify({
            type: "mute_toggle",
            payload: { is_muted: isMuted },
          }),
        );
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Connection error");
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);

        if (event.code === 4001) {
          setError("Voice auth failed (invalid token)");
        } else if (event.code === 4002) {
          setError("You must join the room before voice chat");
        } else if (event.code !== 1000 && event.reason) {
          setError(event.reason);
        }
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Microphone access denied";
      setError(message);
      setIsConnecting(false);
    }
  }, [
    isConnected,
    isConnecting,
    roomId,
    token,
    isMuted,
    userId,
    startVAD,
    handleWebSocketMessage,
  ]);

  // ── Disconnect ────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    // Close all peer connections
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

    // Close WebSocket
    wsRef.current?.close();
    wsRef.current = null;

    // Stop local stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLocalStream(null);

    // Stop and release remote audio outputs
    remoteAudioElsRef.current.forEach((audioEl) => {
      audioEl.pause();
      audioEl.srcObject = null;
    });
    remoteAudioElsRef.current.clear();

    // Cleanup VAD
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;

    // Clear speaking timeouts
    speakingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    speakingTimeoutRef.current.clear();

    // Reset state
    setSpeakingUsers(new Set());
    setMutedUsers(new Set());
    setRemoteStreams(new Map());
    setIsConnected(false);
    setIsMuted(true);
    setIsDeafened(true);
  }, []);

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = !next;
      });

      setMutedUsers((prevMuted) => {
        const updated = new Set(prevMuted);
        if (next) updated.add(userId);
        else updated.delete(userId);
        return updated;
      });

      // Broadcast mute state via WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "mute_toggle",
            payload: { is_muted: next },
          }),
        );
      }

      return next;
    });
  }, [userId]);

  // ── Deafen toggle (speaker on/off) ──────────────────────────────────────
  const toggleDeafen = useCallback(() => {
    setIsDeafened((prev) => {
      const next = !prev;
      remoteAudioElsRef.current.forEach((audioEl) => {
        audioEl.muted = next;
        if (!next) {
          const playPromise = audioEl.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
              // Ignore play errors; user can retry by toggling speaker.
            });
          }
        }
      });
      return next;
    });
  }, []);

  useEffect(() => {
    remoteStreams.forEach((stream, remoteUserId) => {
      attachRemoteAudio(remoteUserId, stream);
    });
  }, [remoteStreams, attachRemoteAudio]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (isConnected) disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return {
    isConnected,
    isConnecting,
    isMuted,
    isDeafened,
    localStream,
    error,
    speakingUsers,
    mutedUsers,
    remoteStreams,
    connect,
    disconnect,
    toggleMute,
    toggleDeafen,
  };
}
