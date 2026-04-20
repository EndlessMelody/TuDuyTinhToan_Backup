"use client";

/**
 * TasteVault — Discover v5 (orchestrator)
 * ─────────────────────────────────────────────────────────────────
 * Composes Fold 4 — COLLECTION:
 *
 *   ┌─ COLLECTION · The Taste Vault ── [←] [→] ─┐
 *   │  Curated foods worth saving                   │
 *   │  ─────────────────────────────────────────   │
 *   │  [VaultCard][VaultCard][VaultCard][VaultCard]→│
 *   └───────────────────────────────────────────────┘
 *
 * Horizontal scroll with prev/next arrow controls. Each card shows
 * XP value (match-based) with animated glow, rating badge, and quick
 * metadata. Skeleton, error, and empty states included.
 */
import React, { useRef } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import { DiscoverSection, GlassCard } from "@/components/primitives";
import { tokens } from "@/styles/tokens";
import { useRecommendations } from "@/hooks/useRecommendations";

import { VaultCardV2 } from "./vault";

// ─── Scroll controls ─────────────────────────────────────────────
const ScrollControls: React.FC<{
  onScrollLeft: () => void;
  onScrollRight: () => void;
}> = ({ onScrollLeft, onScrollRight }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: tokens.space[2],
    }}
  >
    <button
      type="button"
      onClick={onScrollLeft}
      aria-label="Scroll left"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: tokens.radius.md,
        backgroundColor: tokens.color.surfaceMuted,
        border: `1px solid ${tokens.color.border}`,
        color: tokens.color.textMuted,
        cursor: "pointer",
        transition: "background-color 150ms var(--dsc-ease-out)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.color.surfaceInset;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.color.surfaceMuted;
      }}
    >
      <ChevronLeft size={18} strokeWidth={2.4} />
    </button>
    <button
      type="button"
      onClick={onScrollRight}
      aria-label="Scroll right"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: tokens.radius.md,
        backgroundColor: tokens.color.surfaceMuted,
        border: `1px solid ${tokens.color.border}`,
        color: tokens.color.textMuted,
        cursor: "pointer",
        transition: "background-color 150ms var(--dsc-ease-out)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.color.surfaceInset;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.color.surfaceMuted;
      }}
    >
      <ChevronRight size={18} strokeWidth={2.4} />
    </button>
  </div>
);

// ─── Skeletons ───────────────────────────────────────────────────
const VaultSkeleton: React.FC = () => (
  <div
    style={{
      flexShrink: 0,
      width: 260,
      minWidth: 260,
      height: 210,
      borderRadius: tokens.radius.xl,
      backgroundImage:
        "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.04) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }}
  />
);

// ─── Inline notice ───────────────────────────────────────────────
const InlineNotice: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
  tone?: "danger" | "muted";
}> = ({ icon, title, message, tone = "muted" }) => {
  const accent =
    tone === "danger" ? tokens.color.danger : tokens.color.textMuted;
  return (
    <GlassCard
      variant="flat"
      padding="lg"
      radius="lg"
      fillWidth
      style={{
        display: "flex",
        alignItems: "center",
        gap: tokens.space[4],
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: tokens.radius.md,
          backgroundColor: `${accent}14`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: accent,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: tokens.type.size.bodySm,
            fontWeight: tokens.type.weight.bold,
            color: tokens.color.text,
            marginBottom: 2,
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            fontSize: tokens.type.size.caption,
            color: tokens.color.textMuted,
          }}
        >
          {message}
        </span>
      </div>
    </GlassCard>
  );
};

// ─── Main component ──────────────────────────────────────────────
export const TasteVault: React.FC = () => {
  const vaultRef = useRef<HTMLDivElement>(null);
  const { picks, loading, error } = useRecommendations(6, undefined, "food");

  const scrollVault = (direction: "left" | "right") => {
    if (vaultRef.current) {
      vaultRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  const subtitle = loading
    ? "Curating foods worth saving…"
    : error
      ? "Couldn't reach the vault"
      : picks.length > 0
        ? `Curated foods worth saving · ${picks.length} items`
        : "No items in your vault yet — start swiping to collect";

  return (
    <DiscoverSection
      eyebrow="Collection"
      title="Your Taste Vault"
      subtitle={subtitle}
      icon={<Bookmark size={18} />}
      accent={tokens.color.warning}
      action={
        <ScrollControls
          onScrollLeft={() => scrollVault("left")}
          onScrollRight={() => scrollVault("right")}
        />
      }
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            gap: tokens.space[3],
            overflowX: "auto",
            paddingBottom: 4,
          }}
          className="no-scrollbar"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <VaultSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <InlineNotice
          icon={<AlertTriangle size={18} strokeWidth={2.2} />}
          title="Couldn't load the vault"
          message={error}
          tone="danger"
        />
      ) : picks.length === 0 ? (
        <InlineNotice
          icon={<Bookmark size={18} strokeWidth={2.2} />}
          title="Your vault is empty"
          message="Start swiping to collect foods worth saving."
        />
      ) : (
        <div
          ref={vaultRef}
          style={{
            display: "flex",
            gap: tokens.space[3],
            overflowX: "auto",
            paddingBottom: 4,
          }}
          className="no-scrollbar"
        >
          {picks.map((pick, i) => {
            const matchPct =
              pick.match_score > 1 ? pick.match_score : pick.match_score * 100;
            return (
              <VaultCardV2
                key={pick.place_id}
                title={pick.name}
                xp={`${Math.round(matchPct)}XP`}
                img={
                  pick.image_url ||
                  "https://images.unsplash.com/photo-1544025162-d76694265947?w=520&h=360&fit=crop"
                }
                tags={
                  pick.price_range
                    ? `Food • ${pick.price_range}`
                    : "Recommended Food"
                }
                rating={Number(
                  Math.min(5, Math.max(3.8, matchPct / 20)).toFixed(1),
                )}
                index={i}
              />
            );
          })}
        </div>
      )}
    </DiscoverSection>
  );
};
