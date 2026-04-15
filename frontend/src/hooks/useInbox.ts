"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPatch } from "@/lib/api";

export interface InboxConversation {
  partner_id: number;
  partner_name: string;
  partner_avatar: string | null;
  last_message: string;
  last_message_time: string;
  last_message_at: string;
  unread_count: number;
  is_sent_by_me: boolean;
}

export function useInbox() {
  const [conversations, setConversations] = useState<InboxConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchInbox = useCallback(async () => {
    try {
      const data = await apiGet<InboxConversation[]>("/api/v1/messages/inbox");
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      // silently fail on poll errors
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await apiGet<InboxConversation[]>("/api/v1/messages/inbox");
      if (mounted) {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Polling
  useEffect(() => {
    pollRef.current = setInterval(fetchInbox, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchInbox]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  const markRead = useCallback(async (partnerId: number) => {
    try {
      await apiPatch(`/api/v1/messages/${partnerId}/read`, {});
      // Optimistically update local state
      setConversations((prev) =>
        prev.map((c) =>
          c.partner_id === partnerId ? { ...c, unread_count: 0 } : c,
        ),
      );
    } catch {
      // silently fail
    }
  }, []);

  return {
    conversations,
    loading,
    totalUnread,
    refresh: fetchInbox,
    markRead,
  };
}
