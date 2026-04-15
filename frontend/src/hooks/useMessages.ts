"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPost } from "@/lib/api";

export interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
  is_read: boolean;
  created_at: string;
}

export function useMessages(otherUserId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otherIdRef = useRef(otherUserId);
  otherIdRef.current = otherUserId;

  const fetchMessages = useCallback(async () => {
    const id = otherIdRef.current;
    if (!id) return;
    try {
      const data = await apiGet<ChatMessage[]>(`/api/v1/messages/${id}`);
      if (otherIdRef.current === id) {
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently fail on poll errors
    }
  }, []);

  useEffect(() => {
    if (!otherUserId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));

    pollRef.current = setInterval(fetchMessages, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [otherUserId, fetchMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const id = otherIdRef.current;
      if (!id || !text.trim()) return;

      const optimisticId = -Date.now();
      const now = new Date();
      const timeStr = now
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        .replace(/^0/, "");

      const optimistic: ChatMessage = {
        id: optimisticId,
        text,
        sender: "me",
        time: timeStr,
        is_read: false,
        created_at: now.toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      setSending(true);

      try {
        const sent = await apiPost<ChatMessage>(`/api/v1/messages/${id}`, {
          text,
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? sent : m)),
        );
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      } finally {
        setSending(false);
      }
    },
    [],
  );

  return { messages, loading, sending, sendMessage, refetch: fetchMessages };
}
