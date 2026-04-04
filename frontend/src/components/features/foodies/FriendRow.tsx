"use client";

import React from "react";
import {
  Row,
  Column,
  Heading,
  Text,
  Avatar,
  IconButton,
  Button,
} from "@/components/OnceUI";
import { MessageSquare, MapPin } from "lucide-react";

export interface Friend {
  id: number;
  name: string;
  status: string;
  note: string;
  avatar: string;
  cover: string;
  match?: number;
  isOnline?: boolean;
}

interface FriendRowProps {
  friend: Friend;
  onMessage: (friend: Friend) => void;
  onInvite: (friend: Friend) => void;
  isCompact?: boolean;
}

// ─── SVG circular match gauge ───
function MatchGauge({ pct }: { pct: number }) {
  const size = 56;
  const strokeW = 4;
  const r = (size - strokeW * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  const color = pct >= 85 ? "#16A34A" : pct >= 70 ? "#D97706" : "#9CA3AF";

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.07)"
          strokeWidth={strokeW}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <span
          style={{ fontSize: "12px", fontWeight: 800, color, lineHeight: 1 }}
        >
          {pct}
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            color: "rgba(0,0,0,0.35)",
            lineHeight: 1,
          }}
        >
          %
        </span>
      </div>
    </div>
  );
}

// ─── Activity chip (emoji → color mapping) ───
const ACTIVITY_MAP: { emoji: string; color: string; bg: string }[] = [
  { emoji: "🍣", color: "#C2410C", bg: "rgba(239,68,68,0.09)" },
  { emoji: "🍜", color: "#B45309", bg: "rgba(245,158,11,0.10)" },
  { emoji: "☕", color: "#78350F", bg: "rgba(180,83,9,0.10)" },
  { emoji: "🍔", color: "#854D0E", bg: "rgba(234,179,8,0.10)" },
  { emoji: "🌶️", color: "#B91C1C", bg: "rgba(239,68,68,0.09)" },
  { emoji: "🍕", color: "#C2410C", bg: "rgba(249,115,22,0.10)" },
];

function ActivityChip({ status }: { status: string }) {
  const found = ACTIVITY_MAP.find((a) => status.includes(a.emoji));
  const color = found?.color ?? "rgba(0,0,0,0.5)";
  const bg = found?.bg ?? "rgba(0,0,0,0.04)";
  const emoji = found?.emoji ?? "📍";
  const label = status
    .replace(/[\u{1F300}-\u{1FFFF}]|\u{1F32E}|\u{1F336}\uFE0F/gu, "")
    .trim();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 20,
        backgroundColor: bg,
        border: `1px solid ${color}25`,
        maxWidth: "100%",
      }}
    >
      <span style={{ fontSize: 13 }}>{emoji}</span>
      <Text
        variant="body-default-xs"
        style={{
          color,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </Text>
    </div>
  );
}

// ─── Main component ───
export const FriendRow: React.FC<FriendRowProps> = ({
  friend,
  onMessage,
  onInvite,
  isCompact = false,
}) => {
  /* ── COMPACT (chat sidebar) ── */
  if (isCompact) {
    return (
      <Row
        vertical="center"
        gap="12"
        onClick={() => onMessage(friend)}
        paddingX="16"
        paddingY="14"
        radius="m"
        className="messenger-list-item"
        style={{
          cursor: "pointer",
          transition: "background-color 0.15s",
          backgroundColor: "transparent",
          minHeight: 68,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar src={friend.avatar} size="l" />
          {friend.isOnline && (
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#34C759",
                border: "2.5px solid #F8F8FA",
              }}
            />
          )}
        </div>
        <Column flexGrow={1} style={{ overflow: "hidden", gap: 1 }}>
          <Row
            vertical="center"
            style={{ justifyContent: "space-between", gap: 8 }}
          >
            <Text
              style={{
                color: "#1C1C1E",
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "-0.2px",
              }}
            >
              {friend.name}
            </Text>
            <Text
              variant="body-default-xs"
              style={{ color: "rgba(0,0,0,0.28)", flexShrink: 0 }}
            >
              9:41 AM
            </Text>
          </Row>
          <Text
            style={{
              color: "rgba(0,0,0,0.45)",
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {friend.status
              .replace(/[\u{1F300}-\u{1FFFF}]|\u{1F336}\uFE0F/gu, "")
              .trim()}
          </Text>
        </Column>
        <style jsx>{`
          .messenger-list-item:hover {
            background-color: rgba(0, 0, 0, 0.03) !important;
          }
          .messenger-list-item:active {
            background-color: rgba(0, 0, 0, 0.06) !important;
          }
        `}</style>
      </Row>
    );
  }

  /* ── FULL CARD (expanded) ── */
  return (
    <Column
      fillWidth
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* ── Cover hero image ── */}
      <div
        style={{
          position: "relative",
          height: 120,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={friend.cover}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.9) 90%, white 100%)",
          }}
        />
        {/* Online badge */}
        {friend.isOnline && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(52,199,89,0.25)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#34C759",
                boxShadow: "0 0 0 2px rgba(52,199,89,0.25)",
              }}
            />
            <Text
              variant="body-default-xs"
              style={{ color: "#16A34A", fontWeight: 700 }}
            >
              Online
            </Text>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "0 24px 20px", marginTop: -16 }}>
        {/* Avatar + name row */}
        <Row vertical="center" gap="14" style={{ marginBottom: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={friend.avatar}
              size="l"
              style={{
                border: "3px solid white",
                display: "block",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            />
          </div>
          <Column style={{ gap: 1, flex: 1, overflow: "hidden" }}>
            <Heading
              variant="heading-strong-s"
              style={{ color: "#1C1C1E", letterSpacing: "-0.3px" }}
            >
              {friend.name}
            </Heading>
            <Row vertical="center" gap="4">
              <MapPin size={11} color="rgba(0,0,0,0.3)" />
              <Text
                variant="body-default-xs"
                style={{ color: "rgba(0,0,0,0.4)", fontWeight: 500 }}
              >
                {friend.note}
              </Text>
            </Row>
          </Column>
          {/* Match gauge — right side of name row */}
          {friend.match !== undefined && (
            <Column style={{ alignItems: "center", gap: 2, flexShrink: 0 }}>
              <MatchGauge pct={friend.match} />
              <Text
                variant="body-default-xs"
                style={{
                  color: "rgba(0,0,0,0.35)",
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                Taste Match
              </Text>
            </Column>
          )}
        </Row>

        {/* Activity chip + actions */}
        <Row
          vertical="center"
          style={{ justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
        >
          <ActivityChip status={friend.status} />

          <Row gap="8" vertical="center" style={{ flexShrink: 0 }}>
            <IconButton
              icon={<MessageSquare size={16} />}
              onClick={() => onMessage(friend)}
              variant="tertiary"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "#F2F2F7",
                color: "#8E8E93",
              }}
            />
            <Button
              variant="primary"
              onClick={() => onInvite(friend)}
              style={{
                borderRadius: 10,
                fontWeight: 700,
                padding: "0 18px",
                height: 36,
                backgroundColor: "#007AFF",
                fontSize: "13px",
              }}
            >
              Invite
            </Button>
          </Row>
        </Row>
      </div>
    </Column>
  );
};
