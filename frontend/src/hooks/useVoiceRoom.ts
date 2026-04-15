/**
 * useVoiceRoom — Voice Chat Scaffold
 *
 * This hook abstracts WebRTC voice-channel logic so the underlying
 * implementation can be swapped later (Livekit, Daily.co, Agora, etc.)
 * without touching UI components.
 *
 * Current implementation: browser getUserMedia stub.
 * To upgrade: replace the connect/disconnect internals with a real SDK call,
 * e.g. `import { Room } from 'livekit-client'` and wire it in below.
 *
 * Usage:
 *   const { isConnected, isMuted, localStream, connect, disconnect, toggleMute, speakingUsers } = useVoiceRoom(roomId);
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface VoiceRoomState {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  localStream: MediaStream | null;
  error: string | null;
  speakingUsers: Set<number>;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
}

export function useVoiceRoom(roomId: string | number): VoiceRoomState {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speakingUsers, setSpeakingUsers] = useState<Set<number>>(new Set());

  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  // ── Voice activity detection (VAD) on local mic ──────────────────────────
  const startVAD = useCallback((stream: MediaStream) => {
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
        setSpeakingUsers((prev) => {
          const next = new Set(prev);
          if (avg > 12) next.add(0); // 0 = local user
          else next.delete(0);
          return next;
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // AudioContext may not be available in all environments — ignore silently
    }
  }, []);

  // ── Connect ───────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    setError(null);

    try {
      /**
       * SWAP POINT — replace getUserMedia with your SDK connection call:
       *
       * Livekit example:
       *   const room = new Room();
       *   await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
       *   const track = await createLocalAudioTrack();
       *   await room.localParticipant.publishTrack(track);
       *
       * Daily.co example:
       *   const call = DailyIframe.createCallObject();
       *   await call.join({ url: `https://your-domain.daily.co/${roomId}` });
       */
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      setLocalStream(stream);
      startVAD(stream);
      setIsConnected(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Microphone access denied";
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting, startVAD]);

  // ── Disconnect ────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLocalStream(null);

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    setSpeakingUsers(new Set());

    setIsConnected(false);
    setIsMuted(false);

    /**
     * SWAP POINT — add SDK teardown here:
     *   await room.disconnect();
     *   call.destroy();
     */
  }, []);

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = !next;
      });
      return next;
    });
  }, []);

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
    localStream,
    error,
    speakingUsers,
    connect,
    disconnect,
    toggleMute,
  };
}
