"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  motion,
  PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  X,
  Heart,
  Star,
  Undo2,
  Sparkles,
  Archive,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { useGroupSwipe, type GroupCard } from "@/hooks/useGroupSwipe";
import { TourDNABar } from "./TourDNABar";
import { GroupVaultSheet } from "./GroupVaultSheet";
import { GroupResultsView } from "./GroupResultsView";

// ─── Swipe Card ───────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 100;
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop";

function GroupSwipeCard({
  card,
  active,
  onSwipeRight,
  onSwipeLeft,
}: {
  card: GroupCard;
  active: boolean;
  onSwipeRight: (id: number) => void;
  onSwipeLeft: (id: number) => void;
}) {
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);
  const dragX = useMotionValue(0);
  const likeOpacity = useTransform(dragX, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(dragX, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const cardRotate = useTransform(dragX, [-300, 300], [-18, 18]);

  const dragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setExitX(500);
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipeRight(card.id);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setExitX(-500);
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipeLeft(card.id);
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
      dragX.set(0);
    }
  };

  const imgUrl =
    card.image_url && card.image_url.trim() !== "" ? card.image_url : FALLBACK_IMG;

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.12}
      onDragEnd={dragEnd}
      animate={controls}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        cursor: active ? "grab" : "auto",
        zIndex: active ? 10 : 0,
        rotate: active ? cardRotate : 0,
        x: dragX,
        touchAction: "none",
        backgroundColor: "#1C1C1E",
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.25 } }}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
      onDrag={(_e: unknown, info: PanInfo) => dragX.set(info.offset.x)}
    >
      <img
        src={imgUrl}
        alt={card.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Like overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.45) 0%, transparent 60%)",
          opacity: likeOpacity,
          pointerEvents: "none",
        }}
      />
      {/* Pass overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(225deg, rgba(239,68,68,0.45) 0%, transparent 60%)",
          opacity: passOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Starred badge */}
      {card.is_starred_by_teammate && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 20,
            background: "rgba(255,149,0,0.9)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <Star size={12} fill="#fff" /> Teammate starred this!
        </div>
      )}

      {/* Match score badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "5px 10px",
          borderRadius: 20,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {Math.round(card.match_score)}% match
      </div>

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "24px 24px",
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          {card.name}
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {[
            card.price_range,
            card.distance_km != null
              ? `${card.distance_km.toFixed(1)} km`
              : null,
            card.reason,
          ]
            .filter(Boolean)
            .join(" · ") || "TasteMap Place"}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function GroupActionControls({
  onSkip,
  onLike,
  onStar,
  onUndo,
  disabled,
}: {
  onSkip: () => void;
  onLike: () => void;
  onStar: () => void;
  onUndo: () => void;
  disabled: boolean;
}) {
  const springTap = { type: "spring", stiffness: 450, damping: 15 } as const;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "12px 0",
      }}
    >
      {/* Undo */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.08 }}
        whileTap={disabled ? {} : { scale: 0.88, transition: springTap }}
        onClick={onUndo}
        disabled={disabled}
        title="Undo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,149,0,0.3)",
          backgroundColor: "rgba(255,149,0,0.08)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Undo2 size={18} color="#FF9500" />
      </motion.button>

      {/* Skip */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.08 }}
        whileTap={
          disabled ? {} : { scale: 0.88, rotate: -15, transition: springTap }
        }
        onClick={onSkip}
        disabled={disabled}
        title="Skip"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "2px solid rgba(239,68,68,0.35)",
          backgroundColor: "rgba(239,68,68,0.08)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          boxShadow: "0 4px 16px rgba(239,68,68,0.12)",
        }}
      >
        <X size={24} color="#ef4444" strokeWidth={2.5} />
      </motion.button>

      {/* Like */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.08 }}
        whileTap={
          disabled ? {} : { scale: 0.88, rotate: 15, transition: springTap }
        }
        onClick={onLike}
        disabled={disabled}
        title="Like"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "2px solid rgba(34,197,94,0.35)",
          backgroundColor: "rgba(34,197,94,0.08)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          boxShadow: "0 4px 16px rgba(34,197,94,0.12)",
        }}
      >
        <Heart size={24} color="#22c55e" strokeWidth={2.5} />
      </motion.button>

      {/* Star */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={
          disabled ? {} : { scale: 0.85, rotate: 20, transition: springTap }
        }
        onClick={onStar}
        disabled={disabled}
        title="Super Like (Star)"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,149,0,0.4)",
          background: "linear-gradient(135deg, rgba(255,149,0,0.15), rgba(255,204,2,0.08))",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          boxShadow: "0 4px 16px rgba(255,149,0,0.15)",
        }}
      >
        <Star size={20} color="#FF9500" fill="#FF9500" />
      </motion.button>
    </div>
  );
}

// ─── Main GroupSwipeView ──────────────────────────────────────────────────────

interface GroupSwipeViewProps {
  groupId: string;
  isHost: boolean;
  onStatusChange?: (status: string) => void;
}

export function GroupSwipeView({
  groupId,
  isHost,
  onStatusChange,
}: GroupSwipeViewProps) {
  const {
    cards,
    loadingCards,
    swipeRight,
    swipeLeft,
    star,
    undo,
    swiping,
    groupVector,
    vaultCount,
    vault,
    loadingVault,
    fetchVault,
    results,
    finishing,
    finish,
  } = useGroupSwipe({ groupId, enabled: true });

  const [showVault, setShowVault] = useState(false);
  const cardStackRef = useRef<HTMLDivElement>(null);

  const topCard = cards.length > 0 ? cards[0] : null;

  const handleSkip = useCallback(() => {
    if (topCard) swipeLeft(topCard.id);
  }, [topCard, swipeLeft]);

  const handleLike = useCallback(() => {
    if (topCard) swipeRight(topCard.id);
  }, [topCard, swipeRight]);

  const handleStar = useCallback(() => {
    if (topCard) {
      star(topCard.id);
      toast.success("⭐ Super Liked!");
    }
  }, [topCard, star]);

  const handleUndo = useCallback(() => {
    undo();
    toast("↶ Undone last swipe");
  }, [undo]);

  const handleFinish = useCallback(async () => {
    const res = await finish(5);
    if (res.length > 0) {
      onStatusChange?.("completed");
    }
  }, [finish, onStatusChange]);

  const handleOpenVault = useCallback(() => {
    fetchVault();
    setShowVault(true);
  }, [fetchVault]);

  // If results exist, show results view
  if (results && results.length > 0) {
    return <GroupResultsView results={results} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Tour DNA Bar */}
      <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
        <TourDNABar groupVector={groupVector} />
      </div>

      {/* Card Stack */}
      <div
        ref={cardStackRef}
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "8px 24px",
        }}
      >
        {loadingCards && cards.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "3px solid rgba(255,107,53,0.3)",
                borderTopColor: "#ff6b35",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: 14, color: "#8E8E93", fontWeight: 500 }}>
              Loading places...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "32px 24px",
              borderRadius: 20,
              backgroundColor: "#F5F5F7",
              border: "1px solid #E5E5EA",
              textAlign: "center",
            }}
          >
            <Sparkles size={32} style={{ color: "#ff6b35" }} />
            <h4
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1C1C1E",
              }}
            >
              All caught up!
            </h4>
            <p style={{ fontSize: 13, color: "#8E8E93", lineHeight: 1.5 }}>
              You&apos;ve swiped through all recommendations. Wait for new cards
              or ask the host to finish.
            </p>
          </motion.div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              aspectRatio: "3 / 4",
            }}
          >
            <AnimatePresence>
              {cards
                .slice(0, 3)
                .map((card, index) => (
                  <GroupSwipeCard
                    key={card.id}
                    card={card}
                    active={index === 0}
                    onSwipeRight={swipeRight}
                    onSwipeLeft={swipeLeft}
                  />
                ))
                .reverse()}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div style={{ flexShrink: 0 }}>
        <GroupActionControls
          onSkip={handleSkip}
          onLike={handleLike}
          onStar={handleStar}
          onUndo={handleUndo}
          disabled={swiping || cards.length === 0}
        />
      </div>

      {/* Bottom toolbar: Vault + Finish */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px 16px",
          flexShrink: 0,
        }}
      >
        {/* Vault button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenVault}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 12,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(99,102,241,0.08)",
            color: "#6366F1",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Archive size={14} />
          Vault ({vaultCount})
        </motion.button>

        {/* Finish button (Host only) */}
        {isHost && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFinish}
            disabled={finishing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #34C759, #1FAD45)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: finishing ? "wait" : "pointer",
              boxShadow: "0 4px 16px rgba(52,199,89,0.3)",
              opacity: finishing ? 0.7 : 1,
            }}
          >
            <Trophy size={14} />
            {finishing ? "Calculating..." : "Finish & Reveal"}
          </motion.button>
        )}
      </div>

      {/* Vault Sheet */}
      <GroupVaultSheet
        open={showVault}
        onClose={() => setShowVault(false)}
        vault={vault}
        loading={loadingVault}
      />
    </div>
  );
}
