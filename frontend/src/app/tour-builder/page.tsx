"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  IconButton,
} from "@/components/OnceUI";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  Sparkles,
  Clock,
  DollarSign,
  Route,
  Undo2,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Tour Builder tokens & components
import { surface, accent, text, border, radius, shadow } from "./tokens";
import {
  TimelineNode,
  TimelineConnector,
  StatPill,
  StatusBadge,
  RouteChip,
} from "./components";

const MapWidget = dynamic(() => import("@/components/MapWidget"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: surface.page,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: radius.full,
          border: `2px solid ${border.medium}`,
          borderTopColor: accent.primary,
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  ),
});

// ═══════════ CARD DATA ═══════════ //
interface CardData {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  match: number;
  distance: string;
  price: string;
  img: string;
  color: string; // ambient glow color
}

const FOOD_CARDS: CardData[] = [
  {
    id: 1,
    title: "Bánh Mì Cô Thúy",
    subtitle: "Street Food • Dĩ An",
    tags: ["Crispy", "Budget", "Iconic"],
    match: 98,
    distance: "0.8km",
    price: "25k",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=900&fit=crop",
    color: "#FF6B35",
  },
  {
    id: 2,
    title: "Neon Ramen House",
    subtitle: "Japanese • District 1",
    tags: ["Spicy", "Umami", "Late Night"],
    match: 94,
    distance: "2.1km",
    price: "120k",
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=900&fit=crop",
    color: "#E63946",
  },
  {
    id: 3,
    title: "Matcha Garden",
    subtitle: "Cafe • Thủ Đức",
    tags: ["Quiet", "Sweet", "Aesthetic"],
    match: 91,
    distance: "1.5km",
    price: "65k",
    img: "https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=600&h=900&fit=crop",
    color: "#2A9D8F",
  },
  {
    id: 4,
    title: "Sky Lounge",
    subtitle: "Cocktails • Rooftop",
    tags: ["Nightlife", "View", "Premium"],
    match: 87,
    distance: "3.2km",
    price: "200k",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=900&fit=crop",
    color: "#7B2FF7",
  },
  {
    id: 5,
    title: "Phở Sáng Sớm",
    subtitle: "Vietnamese • Bình Dương",
    tags: ["Breakfast", "Classic", "Warm"],
    match: 96,
    distance: "0.5km",
    price: "45k",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=900&fit=crop",
    color: "#F4A261",
  },
  {
    id: 6,
    title: "BBQ Midnight",
    subtitle: "Grill • Late Night",
    tags: ["Smoky", "Group", "Beer"],
    match: 89,
    distance: "1.8km",
    price: "150k",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=900&fit=crop",
    color: "#E76F51",
  },
];

const TOTAL_NODES = 4;

export default function TourBuilderPage() {
  const [deck, setDeck] = useState<CardData[]>(FOOD_CARDS);
  const [filledNodes, setFilledNodes] = useState<(CardData | null)[]>(
    Array(TOTAL_NODES).fill(null),
  );
  const [isTourReady, setIsTourReady] = useState(false);
  const [discardDir, setDiscardDir] = useState<"left" | "right" | null>(null);
  const [lastDiscarded, setLastDiscarded] = useState<CardData | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextEmptyIndex = filledNodes.findIndex((n) => n === null);
  const activeCard = deck[0] ?? null;
  const activeColor = activeCard?.color ?? "#333";

  // Auto-dismiss undo after 5s
  useEffect(() => {
    if (lastDiscarded) {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => setLastDiscarded(null), 5000);
    }
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, [lastDiscarded]);

  const handleUndo = useCallback(() => {
    if (!lastDiscarded) return;
    setDeck((prev) => [lastDiscarded, ...prev]);
    setLastDiscarded(null);
  }, [lastDiscarded]);

  // ─── Drag Logic ─── //
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipeThreshold = 120;
      const downThreshold = 180;

      // Swipe LEFT or RIGHT → discard
      if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
        const discarded = deck[0];
        setDiscardDir(offset.x > 0 ? "right" : "left");
        setTimeout(() => {
          setDeck((prev) => prev.slice(1));
          setDiscardDir(null);
          setLastDiscarded(discarded);
        }, 300);
        return;
      }

      // Drag DOWN → snap to node
      if (offset.y > downThreshold && nextEmptyIndex !== -1) {
        const card = deck[0];
        setFilledNodes((prev) => {
          const next = [...prev];
          next[nextEmptyIndex] = card;
          // Check if tour is complete
          if (next.filter(Boolean).length === TOTAL_NODES) {
            setTimeout(() => setIsTourReady(true), 600);
          }
          return next;
        });
        setDeck((prev) => prev.slice(1));
      }
    },
    [deck, nextEmptyIndex],
  );

  // ─── Tour Complete Map View ─── //
  if (isTourReady) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          backgroundColor: surface.page,
        }}
      >
        {/* Map Background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <MapWidget />
        </div>

        {/* Dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(8,8,12,0.3) 0%, rgba(8,8,12,0.7) 100%)",
            zIndex: 1,
          }}
        />

        {/* Glassmorphic Summary Panel */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", damping: 25 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: "680px",
            maxWidth: "92vw",
            backgroundColor: "rgba(18,18,23,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "32px 40px",
          }}
        >
          <Column style={{ gap: "24px" }}>
            <Row
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Column style={{ gap: "4px" }}>
                <Heading variant="heading-strong-l" style={{ color: "white" }}>
                  Your Tour is Ready! 🎉
                </Heading>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.85rem",
                  }}
                >
                  4 stops curated by your Taste Vector
                </Text>
              </Column>
              <Link href="/">
                <IconButton
                  icon={<ChevronLeft size={20} color="white" />}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                />
              </Link>
            </Row>

            {/* Route Nodes */}
            <Row
              style={{
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filledNodes.map((node, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div
                      style={{
                        width: "32px",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, #00D1B2, rgba(0,209,178,0.3))",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #00D1B2",
                      boxShadow: "0 0 12px rgba(0,209,178,0.4)",
                    }}
                  >
                    {node && (
                      <img
                        src={node.img}
                        alt={node.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </Row>

            {/* Stats */}
            <Row style={{ gap: 16, justifyContent: "center" }}>
              <StatPill
                icon={<Route size={16} color={accent.primary} />}
                label="~6.1km total"
              />
              <StatPill
                icon={<DollarSign size={16} color={accent.warning} />}
                label="~360k VND"
              />
              <StatPill
                icon={<Clock size={16} color={accent.secondary} />}
                label="~3.5 hours"
              />
            </Row>

            {/* CTA */}
            <Button
              size="l"
              onClick={() => {}}
              style={{
                backgroundColor: "#00D1B2",
                color: "#000",
                fontWeight: 700,
                borderRadius: "14px",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                padding: "16px",
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                Start Navigation
              </span>
              <motion.div
                initial={{ x: "-200%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "linear",
                  repeatDelay: 1.5,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "40%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                  transform: "skewX(-20deg)",
                  zIndex: 0,
                }}
              />
            </Button>
          </Column>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Main Spatial UI ─── //
  return (
    <Column
      fillWidth
      fillHeight
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: surface.page,
      }}
    >
      {/* ═══ AMBIENT COLOR BLEED — Enhanced ═══ */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeColor}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.55, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            width: "80vw",
            height: "80vh",
            borderRadius: "50%",
            backgroundColor: activeColor,
            filter: "blur(150px)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* ═══ TOP HEADER ═══ */}
      <Row
        fillWidth
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          flexShrink: 0,
          zIndex: 20,
          backdropFilter: "blur(16px)",
          backgroundColor: surface.overlay,
          borderBottom: `1px solid ${border.subtle}`,
        }}
      >
        <Row style={{ alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ display: "flex" }}>
            <IconButton
              icon={<ChevronLeft size={20} color="rgba(255,255,255,0.7)" />}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          </Link>
          <Column style={{ gap: "2px" }}>
            <Heading variant="heading-strong-m" style={{ color: "white" }}>
              Tour Builder
            </Heading>
            <Row style={{ gap: "6px", alignItems: "center" }}>
              <MapPin size={12} color={accent.brand} />
              <Text
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}
              >
                Dĩ An, Bình Dương
              </Text>
            </Row>
          </Column>
        </Row>

        {/* Cards remaining */}
        <Row
          style={{
            gap: "8px",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Sparkles size={14} color={accent.warning} />
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {deck.length} cards left
          </Text>
        </Row>
      </Row>

      {/* ═══ CENTER STAGE ═══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* Hint labels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "absolute",
            left: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.06)",
              fontSize: "4rem",
              fontWeight: 900,
              letterSpacing: "-2px",
              userSelect: "none",
            }}
          >
            SKIP
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.06)",
              fontSize: "4rem",
              fontWeight: 900,
              letterSpacing: "-2px",
              userSelect: "none",
            }}
          >
            SKIP
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.08)",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "-1px",
              userSelect: "none",
            }}
          >
            ↓ DROP TO ADD
          </Text>
        </motion.div>

        {/* Card Stack */}
        <div style={{ position: "relative", width: "340px", height: "480px" }}>
          <AnimatePresence>
            {deck.length > 0 && (
              <>
                {/* Background card (peek) */}
                {deck[1] && (
                  <motion.div
                    key={`bg-${deck[1].id}`}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 0.92, y: -12, opacity: 0.5 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      borderRadius: "24px",
                      overflow: "hidden",
                      backgroundImage: `url(${deck[1].img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                      }}
                    />
                  </motion.div>
                )}

                {/* Active draggable card */}
                <DraggableCard
                  key={`card-${deck[0].id}`}
                  card={deck[0]}
                  onDragEnd={handleDragEnd}
                  discardDir={discardDir}
                />
              </>
            )}
          </AnimatePresence>

          {deck.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <Sparkles size={48} color="#00D1B2" />
              <Heading variant="heading-strong-m" style={{ color: "white" }}>
                No More Cards
              </Heading>
              <Text
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}
              >
                {filledNodes.filter(Boolean).length}/{TOTAL_NODES} stops
                selected
              </Text>
            </motion.div>
          )}
        </div>
      </div>

      {/* ═══ UNDO PILL ═══ */}
      <AnimatePresence>
        {lastDiscarded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={handleUndo}
            style={{
              position: "fixed",
              bottom: "180px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 24px",
              backgroundColor: "rgba(18,18,23,0.9)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50px",
              cursor: "pointer",
            }}
          >
            <Undo2 size={16} color="#FBBF24" />
            <Text
              style={{ color: "white", fontSize: "0.8rem", fontWeight: 600 }}
            >
              Undo &ldquo;{lastDiscarded.title}&rdquo;
            </Text>
            {/* Timer bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              style={{
                position: "absolute",
                bottom: 0,
                left: "12px",
                right: "12px",
                height: "2px",
                backgroundColor: "#FBBF24",
                borderRadius: "2px",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ LIVE MINI-MAP ═══ */}
      {filledNodes.some(Boolean) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          style={{
            position: "fixed",
            bottom: "180px",
            left: "40px",
            zIndex: 25,
            width: "200px",
            height: "150px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <MapWidget />
          {/* Overlay with nodes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8,8,12,0.3)",
              pointerEvents: "none",
            }}
          >
            <Row
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                right: "8px",
                gap: "4px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filledNodes.map((node, i) => (
                <div
                  key={i}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: node
                      ? node.color
                      : "rgba(255,255,255,0.15)",
                    border: node
                      ? `2px solid ${node.color}`
                      : "1px dashed rgba(255,255,255,0.2)",
                    boxShadow: node ? `0 0 6px ${node.color}80` : "none",
                    transition: "all 0.4s",
                  }}
                />
              ))}
            </Row>
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <MapIcon size={10} color="rgba(255,255,255,0.5)" />
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                }}
              >
                ROUTE PREVIEW
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ BOTTOM TIMELINE ═══ */}
      <Row
        fillWidth
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "160px",
          flexShrink: 0,
          backgroundColor: surface.glass,
          backdropFilter: "blur(24px)",
          borderTop: `1px solid ${border.subtle}`,
          gap: 0,
          zIndex: 20,
          padding: "0 40px",
        }}
      >
        {/* Tour Stats (left) */}
        <Column style={{ gap: 4, flex: 1 }}>
          <Text
            style={{
              color: accent.primary,
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            Route Progress
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            {filledNodes.filter(Boolean).length}/{TOTAL_NODES} stops • Drag
            cards ↓ to build
          </Text>
        </Column>

        {/* Timeline Nodes */}
        <Row style={{ gap: 0, alignItems: "center" }}>
          {filledNodes.map((node, i) => (
            <React.Fragment key={i}>
              {i > 0 && <TimelineConnector isActive={!!node} />}
              <TimelineNode
                index={i}
                imageUrl={node?.img}
                color={node?.color}
                isActive={nextEmptyIndex === i}
                isFilled={!!node}
              />
            </React.Fragment>
          ))}
        </Row>

        {/* CTA (right) */}
        <Column style={{ flex: 1, alignItems: "flex-end" }}>
          <Button
            size="l"
            onClick={() => {
              if (filledNodes.filter(Boolean).length === TOTAL_NODES)
                setIsTourReady(true);
            }}
            style={{
              backgroundColor:
                filledNodes.filter(Boolean).length === TOTAL_NODES
                  ? "#00D1B2"
                  : "rgba(255,255,255,0.06)",
              color:
                filledNodes.filter(Boolean).length === TOTAL_NODES
                  ? "#000"
                  : "rgba(255,255,255,0.3)",
              fontWeight: 700,
              borderRadius: "14px",
              padding: "14px 32px",
              cursor:
                filledNodes.filter(Boolean).length === TOTAL_NODES
                  ? "pointer"
                  : "not-allowed",
              transition: "all 0.4s ease",
              border:
                filledNodes.filter(Boolean).length === TOTAL_NODES
                  ? "none"
                  : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Complete Tour
          </Button>
        </Column>
      </Row>
    </Column>
  );
}

// ═══════════ DRAGGABLE CARD (with FLIP) ═══════════ //

function DraggableCard({
  card,
  onDragEnd,
  discardDir,
}: {
  card: CardData;
  onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  discardDir: "left" | "right" | null;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const scale = useTransform(y, [0, 300], [1, 0.7]);
  const [isFlipped, setIsFlipped] = useState(false);

  const exitX = discardDir === "left" ? -600 : discardDir === "right" ? 600 : 0;
  const exitRotate =
    discardDir === "left" ? -30 : discardDir === "right" ? 30 : 0;

  return (
    <motion.div
      drag={!isFlipped}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      style={{
        x,
        y,
        rotate: isFlipped ? 0 : rotate,
        scale,
        position: "absolute",
        inset: 0,
        zIndex: 5,
        cursor: isFlipped ? "default" : "grab",
        perspective: "1200px",
      }}
      whileDrag={{ cursor: "grabbing" }}
      initial={{ scale: 0.9, opacity: 0, y: 40 }}
      animate={
        discardDir
          ? { x: exitX, opacity: 0, rotate: exitRotate }
          : { scale: 1, opacity: 1, y: 0 }
      }
      exit={{ scale: 0.5, opacity: 0, y: 200 }}
      transition={
        discardDir
          ? { duration: 0.3 }
          : { type: "spring", stiffness: 260, damping: 22 }
      }
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ─── FRONT SIDE ─── */}
        <div
          onDoubleClick={() => setIsFlipped(true)}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: radius.xl,
            overflow: "hidden",
            backgroundImage: `url(${card.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 60px ${card.color}30, ${shadow.insetBorder(border.medium)}`,
          }}
        >
          {/* Ambient glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: radius["2xl"],
              background: `linear-gradient(135deg, ${card.color}60, transparent 50%, ${accent.primary}40)`,
              zIndex: -1,
              filter: "blur(1px)",
            }}
          />

          {/* Premium gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, 
                rgba(0,0,0,0.2) 0%, 
                rgba(0,0,0,0.1) 30%,
                rgba(0,0,0,0.4) 60%,
                rgba(0,0,0,0.95) 100%)`,
              pointerEvents: "none",
            }}
          />

          {/* Top badges - using StatusBadge */}
          <Row
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              zIndex: 3,
              justifyContent: "space-between",
            }}
          >
            <StatusBadge type="match" value={card.match} />
            <StatusBadge type="distance" value={card.distance} />
          </Row>

          {/* Flip hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              padding: "8px 16px",
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              borderRadius: radius.m,
              border: `1px solid ${border.weak}`,
            }}
          >
            <Text
              style={{
                color: text.tertiary,
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              ↻ Double-tap for details
            </Text>
          </motion.div>

          {/* Bottom content */}
          <Column
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 3,
              padding: "32px 24px",
              gap: 14,
            }}
          >
            <Heading
              variant="display-strong-s"
              style={{
                color: text.primary,
                lineHeight: 1.1,
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {card.title}
            </Heading>
            <Text style={{ color: text.secondary, fontSize: "0.9rem" }}>
              {card.subtitle}
            </Text>
            <Row style={{ gap: 8, flexWrap: "wrap" }}>
              {card.tags.map((tag) => (
                <RouteChip key={tag} label={tag} color={card.color} />
              ))}
            </Row>
            <Row style={{ alignItems: "center", gap: 12, marginTop: 4 }}>
              <StatusBadge type="price" value={card.price} />
              <StatusBadge type="time" value="~25 min" />
            </Row>
          </Column>
        </div>

        {/* ─── BACK SIDE (Details) ─── */}
        <div
          onDoubleClick={() => setIsFlipped(false)}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: radius.xl,
            overflow: "hidden",
            backgroundColor: surface.elevated,
            boxShadow: `0 32px 80px rgba(0,0,0,0.7), ${shadow.insetBorder(border.medium)}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image strip with gradient */}
          <div
            style={{ height: "35%", position: "relative", overflow: "hidden" }}
          >
            <img
              src={card.img}
              alt={card.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.9)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, transparent 30%, ${surface.elevated} 100%)`,
              }}
            />
            {/* Colored accent line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 24,
                right: 24,
                height: 3,
                background: `linear-gradient(90deg, ${card.color}, ${accent.primary})`,
                borderRadius: radius.full,
              }}
            />
          </div>

          {/* Details */}
          <div
            style={{
              flex: 1,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Heading variant="heading-strong-m" style={{ color: text.primary }}>
              {card.title}
            </Heading>
            <Text style={{ color: text.tertiary, fontSize: "0.8rem" }}>
              {card.subtitle}
            </Text>

            {/* Stats Row - using StatusBadge */}
            <Row style={{ gap: 10, flexWrap: "wrap" }}>
              <StatusBadge type="rating" value={4.8} />
              <StatusBadge type="price" value={card.price} />
              <StatusBadge type="distance" value={card.distance} />
            </Row>

            {/* Mini Reviews */}
            <Column style={{ gap: "8px" }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Top Reviews
              </Text>
              <Column style={{ gap: "6px" }}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;Absolutely incredible, best in the area!&rdquo; —
                  ⭐⭐⭐⭐⭐
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;Must visit spot, don&apos;t miss it.&rdquo; — ⭐⭐⭐⭐
                </Text>
              </Column>
            </Column>

            {/* Gallery Thumbnails */}
            <Column style={{ gap: "8px" }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Photos
              </Text>
              <Row style={{ gap: "8px" }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <img
                      src={`${card.img}&q=${i * 10}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </Row>
            </Column>

            {/* Flip back hint */}
            <Text
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.65rem",
                textAlign: "center",
                marginTop: "auto",
              }}
            >
              Double-tap to flip back
            </Text>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
