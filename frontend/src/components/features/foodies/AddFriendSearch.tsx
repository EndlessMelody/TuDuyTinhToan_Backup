"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Column, Text, Avatar } from "@/components/OnceUI";
import { Search, UserPlus, Check, Clock, UserCheck } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

interface UserResult {
  id: number;
  username: string;
  display_name?: string;
  avatar_url?: string;
  friendship_status: "pending" | "accepted" | "blocked" | null;
}

interface AddFriendSearchProps {
  onRequestSent?: (userId: number) => void;
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function AddFriendSearch({ onRequestSent }: AddFriendSearchProps) {
  const [query, setQuery] = useState("");
  const [rawResults, setRawResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<Set<number>>(new Set());
  const debouncedQ = useDebounce(query, 300);
  const results = debouncedQ.trim() ? rawResults : [];
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await apiGet<UserResult[]>(
        `/api/v1/users/search?q=${encodeURIComponent(q)}&limit=8`,
      );
      setRawResults(Array.isArray(data) ? data : []);
      setOpen(true);
    } catch {
      setRawResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQ);
  }, [debouncedQ, fetchResults]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAdd = useCallback(
    async (user: UserResult) => {
      if (sent.has(user.id)) return;
      try {
        await apiPost("/api/v1/friends/request", { friend_id: user.id });
        setSent((prev) => new Set(prev).add(user.id));
        onRequestSent?.(user.id);
      } catch {
        // already sent or other error — still mark as sent visually
        setSent((prev) => new Set(prev).add(user.id));
      }
    },
    [sent, onRequestSent],
  );

  function statusLabel(user: UserResult) {
    if (sent.has(user.id) || user.friendship_status === "pending")
      return {
        icon: <Clock size={13} />,
        text: "Pending",
        color: "#D97706",
        bg: "rgba(245,158,11,0.08)",
      };
    if (user.friendship_status === "accepted")
      return {
        icon: <UserCheck size={13} />,
        text: "Friends",
        color: "#16A34A",
        bg: "rgba(52,199,89,0.08)",
      };
    return null;
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Input */}
      <div style={{ position: "relative" }}>
        <Search
          size={15}
          color="rgba(0,0,0,0.3)"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setOpen(true);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by @username or name…"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 14px 11px 40px",
            borderRadius: 12,
            border: "1.5px solid rgba(175,82,222,0.25)",
            backgroundColor: "rgba(175,82,222,0.04)",
            fontSize: 14,
            color: "#1C1C1E",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "rgba(175,82,222,0.6)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "rgba(175,82,222,0.25)")
          }
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              border: "2px solid rgba(175,82,222,0.2)",
              borderTopColor: "#AF52DE",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {results.map((user, idx) => {
            const badge = statusLabel(user);
            const canAdd = !badge && user.friendship_status !== "blocked";
            return (
              <Row
                key={user.id}
                vertical="center"
                gap="12"
                style={{
                  padding: "10px 14px",
                  borderBottom:
                    idx < results.length - 1
                      ? "1px solid rgba(0,0,0,0.04)"
                      : "none",
                  transition: "background 0.12s",
                  cursor: "default",
                }}
                className="add-friend-row"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.display_name || user.username}
                  size="s"
                  style={{ flexShrink: 0 }}
                />
                <Column flexGrow={1} style={{ gap: 1, overflow: "hidden" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1C1C1E",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.display_name || user.username}
                  </Text>
                  <Text
                    variant="body-default-xs"
                    style={{ color: "rgba(0,0,0,0.4)" }}
                  >
                    @{user.username}
                  </Text>
                </Column>

                {badge ? (
                  <Row
                    vertical="center"
                    gap="4"
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      backgroundColor: badge.bg,
                      color: badge.color,
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {badge.icon}
                    {badge.text}
                  </Row>
                ) : canAdd ? (
                  <button
                    onClick={() => handleAdd(user)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: "none",
                      backgroundColor: "#AF52DE",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.85")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <UserPlus size={12} />
                    Add
                  </button>
                ) : (
                  <Row
                    vertical="center"
                    gap="4"
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      backgroundColor: "rgba(52,199,89,0.08)",
                      color: "#16A34A",
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} />
                    Friends
                  </Row>
                )}
              </Row>
            );
          })}
        </div>
      )}

      {open && query.trim() && !loading && results.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            zIndex: 50,
            padding: "20px",
            textAlign: "center",
          }}
        >
          <Text variant="body-default-s" style={{ color: "rgba(0,0,0,0.4)" }}>
            No users found for &ldquo;{query}&rdquo;
          </Text>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
        .add-friend-row:hover { background-color: #F8F8FA; }
      `}</style>
    </div>
  );
}
