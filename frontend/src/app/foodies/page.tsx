"use client";

import React, { useState, useMemo } from "react";
import { Column, Row, Heading, Text, Avatar } from "@/components/OnceUI";
import { Search, Users, Wifi, Flame, X, TrendingUp } from "lucide-react";
import { FriendRow, Friend } from "@/components/features/foodies/FriendRow";
import { useChat } from "@/context/ChatContext";
import { MOCK_FRIENDS } from "@/constants/foodies-data";

type FilterTab = "all" | "online" | "high-match";

const TAB_CONFIG: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <Users size={13} /> },
  { id: "online", label: "Online", icon: <Wifi size={13} /> },
  { id: "high-match", label: "High Match", icon: <Flame size={13} /> },
];

export default function FoodiesPage() {
  const { isChatOpen, setIsChatOpen, setActiveFriend } = useChat();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const handleMessageUser = (friend: Friend) => {
    setActiveFriend(friend);
    setIsChatOpen(true);
  };

  const onlineCount = MOCK_FRIENDS.filter((f) => f.isOnline).length;

  const filtered = useMemo(() => {
    let list = MOCK_FRIENDS;
    if (activeTab === "online") list = list.filter((f) => f.isOnline);
    if (activeTab === "high-match")
      list = list.filter((f) => (f.match ?? 0) >= 80);
    if (query.trim())
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.status.toLowerCase().includes(query.toLowerCase()),
      );
    return list;
  }, [query, activeTab]);

  /* ── Compact (chat-open) mode keeps the old behaviour ── */
  if (isChatOpen) {
    return (
      <Column
        fillHeight
        flexGrow={0}
        flexShrink={0}
        className="no-scrollbar"
        style={{
          width: "320px",
          minWidth: "320px",
          maxWidth: "320px",
          overflowY: "auto",
          backgroundColor: "#F8F8FA",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Compact header */}
        <Column style={{ padding: "20px 16px 0", gap: "12px", flexShrink: 0 }}>
          <Heading
            variant="heading-strong-l"
            style={{ letterSpacing: "-1px", color: "#1C1C1E" }}
          >
            Chats
          </Heading>
          {/* Compact search */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              color="rgba(0,0,0,0.3)"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 10px 8px 32px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.07)",
                backgroundColor: "rgba(0,0,0,0.03)",
                fontSize: "13px",
                color: "#1C1C1E",
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(0,0,0,0.06)",
              margin: "4px 0",
            }}
          />
        </Column>
        <Column style={{ padding: "4px 4px 16px", gap: "2px" }}>
          {filtered.map((f) => (
            <FriendRow
              key={f.id}
              friend={f}
              isCompact
              onMessage={() => handleMessageUser(f)}
              onInvite={(f2) => alert(`Invited ${f2.name}!`)}
            />
          ))}
          {filtered.length === 0 && (
            <Column
              style={{ alignItems: "center", padding: "32px 16px", gap: "8px" }}
            >
              <Text
                variant="body-default-s"
                style={{ color: "rgba(0,0,0,0.3)" }}
              >
                No results
              </Text>
            </Column>
          )}
        </Column>
      </Column>
    );
  }

  /* ── Full (expanded) mode ── */
  const onlineFriends = MOCK_FRIENDS.filter((f) => f.isOnline);
  const highMatchCount = MOCK_FRIENDS.filter(
    (f) => (f.match ?? 0) >= 80,
  ).length;
  const avgMatch = Math.round(
    MOCK_FRIENDS.reduce((s, f) => s + (f.match ?? 0), 0) / MOCK_FRIENDS.length,
  );

  const STATS = [
    {
      icon: <Users size={14} />,
      label: "Total Foodies",
      value: MOCK_FRIENDS.length,
      color: "#007AFF",
    },
    {
      icon: <Wifi size={14} />,
      label: "Online Now",
      value: onlineCount,
      color: "#34C759",
    },
    {
      icon: <Flame size={14} />,
      label: "High Match",
      value: highMatchCount,
      color: "#FF9500",
    },
    {
      icon: <TrendingUp size={14} />,
      label: "Avg Match",
      value: `${avgMatch}%`,
      color: "#AF52DE",
    },
  ];

  return (
    <Column
      fillHeight
      className="no-scrollbar"
      style={{ width: "100%", overflowY: "auto", backgroundColor: "#F2F2F7" }}
    >
      {/* ══ HERO HEADER BAR ══ */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "32px 40px 24px",
        }}
      >
        {/* Title row */}
        <Row
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Column style={{ gap: 4 }}>
            <Heading
              variant="display-strong-m"
              style={{ letterSpacing: "-1.5px", color: "#1C1C1E" }}
            >
              Foodies
            </Heading>
            <Text variant="body-default-s" style={{ color: "rgba(0,0,0,0.4)" }}>
              Find foodies with matching taste vectors — invite them to a tour.
            </Text>
          </Column>
          {/* Online pill */}
          <Row
            style={{
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              backgroundColor: "rgba(52,199,89,0.08)",
              border: "1px solid rgba(52,199,89,0.2)",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#34C759",
                boxShadow: "0 0 0 3px rgba(52,199,89,0.2)",
              }}
            />
            <Text
              variant="body-default-xs"
              style={{ color: "#16A34A", fontWeight: 700 }}
            >
              {onlineCount} online now
            </Text>
          </Row>
        </Row>

        {/* ── Stat pills ── */}
        <Row style={{ gap: 12, flexWrap: "wrap" }}>
          {STATS.map((s) => (
            <Row
              key={s.label}
              style={{
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                backgroundColor: "#F8F8FA",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: 14,
                flex: "1 1 160px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: `${s.color}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <Column style={{ gap: 0 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1C1C1E",
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </Text>
                <Text
                  variant="body-default-xs"
                  style={{ color: "rgba(0,0,0,0.4)", fontWeight: 500 }}
                >
                  {s.label}
                </Text>
              </Column>
            </Row>
          ))}
        </Row>
      </div>

      <Column style={{ padding: "28px 40px 48px", gap: 28 }}>
        {/* ── Online Now spotlight strip ── */}
        {onlineFriends.length > 0 && (
          <Column style={{ gap: 12 }}>
            <Row style={{ alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#34C759",
                  boxShadow: "0 0 0 3px rgba(52,199,89,0.2)",
                }}
              />
              <Text
                variant="body-default-xs"
                style={{
                  color: "#16A34A",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Online Now
              </Text>
            </Row>
            <Row
              style={{ gap: 12, overflowX: "auto", paddingBottom: 4 }}
              className="no-scrollbar"
            >
              {onlineFriends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleMessageUser(f)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: "16px 20px",
                    backgroundColor: "white",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: 16,
                    cursor: "pointer",
                    flexShrink: 0,
                    minWidth: 100,
                    transition: "box-shadow 0.18s",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Avatar
                      src={f.avatar}
                      size="l"
                      style={{
                        border: "2px solid rgba(52,199,89,0.3)",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#34C759",
                        border: "2px solid white",
                      }}
                    />
                  </div>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1C1C1E",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.name.split(" ")[0]}
                  </Text>
                  {f.match !== undefined && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: f.match >= 85 ? "#16A34A" : "#D97706",
                        backgroundColor:
                          f.match >= 85
                            ? "rgba(52,199,89,0.1)"
                            : "rgba(245,158,11,0.1)",
                        padding: "2px 8px",
                        borderRadius: 10,
                      }}
                    >
                      {f.match}%
                    </span>
                  )}
                </button>
              ))}
            </Row>
          </Column>
        )}

        {/* ── Search + Filter bar ── */}
        <Column style={{ gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or activity…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 40px 13px 42px",
                borderRadius: 14,
                border: "1.5px solid rgba(0,0,0,0.07)",
                backgroundColor: "#FFFFFF",
                fontSize: 14,
                color: "#1C1C1E",
                outline: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "rgba(0,0,0,0.3)",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <Row style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === "all"
                  ? MOCK_FRIENDS.length
                  : tab.id === "online"
                    ? MOCK_FRIENDS.filter((f) => f.isOnline).length
                    : MOCK_FRIENDS.filter((f) => (f.match ?? 0) >= 80).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: isActive
                      ? "1.5px solid #007AFF"
                      : "1.5px solid rgba(0,0,0,0.07)",
                    backgroundColor: isActive
                      ? "rgba(0,122,255,0.06)"
                      : "#FFFFFF",
                    color: isActive ? "#007AFF" : "rgba(0,0,0,0.5)",
                    cursor: "pointer",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13,
                    transition: "all 0.16s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    style={{
                      padding: "1px 7px",
                      borderRadius: 10,
                      backgroundColor: isActive
                        ? "rgba(0,122,255,0.12)"
                        : "rgba(0,0,0,0.05)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? "#007AFF" : "rgba(0,0,0,0.4)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            <Text
              variant="body-default-xs"
              style={{ marginLeft: "auto", color: "rgba(0,0,0,0.3)" }}
            >
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Text>
          </Row>
        </Column>

        {/* ── Friend Grid — 3 columns on wide screens ── */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((friend) => (
              <FriendRow
                key={friend.id}
                friend={friend}
                isCompact={false}
                onMessage={() => handleMessageUser(friend)}
                onInvite={(f) => alert(`Invited ${f.name} to a new Food Tour!`)}
              />
            ))}
          </div>
        ) : (
          <Column
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 24px",
              gap: 12,
              backgroundColor: "white",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <Text style={{ fontSize: "2rem" }}>🔍</Text>
            <Heading variant="heading-strong-s" style={{ color: "#1C1C1E" }}>
              No foodies found
            </Heading>
            <Text
              variant="body-default-s"
              style={{ color: "rgba(0,0,0,0.4)", textAlign: "center" }}
            >
              Try a different search term or filter.
            </Text>
          </Column>
        )}
      </Column>
    </Column>
  );
}
