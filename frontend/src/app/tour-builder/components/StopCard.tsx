"use client";

import React from "react";
import { Column, Row, Heading, Text } from "@/components/OnceUI";
import { motion } from "framer-motion";
import { Sparkles, Navigation, DollarSign } from "lucide-react";
import { surface, text, border, radius, shadow, spacing } from "../tokens";
import { RouteChip } from "./RouteChip";
import { StatusBadge } from "./StatusBadge";

export interface StopCardData {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  match: number;
  distance: string;
  price: string;
  img: string;
  color: string;
}

interface StopCardProps {
  card: StopCardData;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export function StopCard({ card, isFlipped = false, onFlip }: StopCardProps) {
  return (
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
        onDoubleClick={onFlip}
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          borderRadius: radius["2xl"],
          overflow: "hidden",
          backgroundImage: `url(${card.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: `${shadow.elevated}, ${shadow.insetBorder(border.medium)}`,
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top badges */}
        <Row
          style={{
            position: "absolute",
            top: spacing.l,
            left: spacing.l,
            right: spacing.l,
            zIndex: 3,
            justifyContent: "space-between",
          }}
        >
          <StatusBadge
            type="match"
            value={`${card.match}% match`}
            icon={<Sparkles size={12} color="#FBBF24" />}
          />
          <StatusBadge
            type="distance"
            value={card.distance}
            icon={<Navigation size={11} color="rgba(255,255,255,0.5)" />}
          />
        </Row>

        {/* Flip hint */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            opacity: 0.15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Double-tap to flip
          </Text>
        </div>

        {/* Bottom content */}
        <Column
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: `${spacing.xl}px ${spacing.l}px`,
            gap: spacing.s,
          }}
        >
          <Heading
            variant="display-strong-s"
            style={{ color: "white", lineHeight: 1.1 }}
          >
            {card.title}
          </Heading>
          <Text style={{ color: text.tertiary, fontSize: "0.9rem" }}>
            {card.subtitle}
          </Text>
          <Row style={{ gap: spacing.xs, flexWrap: "wrap" }}>
            {card.tags.map((tag) => (
              <RouteChip key={tag} label={tag} color={card.color} />
            ))}
          </Row>
          <Row
            style={{
              alignItems: "center",
              gap: spacing.xs,
              marginTop: spacing["2xs"],
            }}
          >
            <DollarSign size={14} color={text.muted} />
            <Text style={{ color: text.tertiary, fontSize: "0.8rem" }}>
              ~{card.price} VND
            </Text>
          </Row>
        </Column>
      </div>

      {/* ─── BACK SIDE ─── */}
      <div
        onDoubleClick={onFlip}
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: radius["2xl"],
          overflow: "hidden",
          backgroundColor: surface.elevated,
          boxShadow: `${shadow.elevated}, ${shadow.insetBorder(border.weak)}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top image strip */}
        <div
          style={{ height: "40%", position: "relative", overflow: "hidden" }}
        >
          <img
            src={card.img}
            alt={card.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, transparent 50%, ${surface.elevated} 100%)`,
            }}
          />
        </div>

        {/* Details */}
        <Column
          style={{
            flex: 1,
            padding: `${spacing.l}px ${spacing.l}px`,
            gap: spacing.m,
          }}
        >
          <Heading variant="heading-strong-m" style={{ color: "white" }}>
            {card.title}
          </Heading>
          <Text style={{ color: text.tertiary, fontSize: "0.8rem" }}>
            {card.subtitle}
          </Text>

          {/* Stats */}
          <Row style={{ gap: spacing.m, flexWrap: "wrap" }}>
            <StatusBadge
              type="rating"
              value="4.8"
              icon={<Sparkles size={14} color="#FBBF24" />}
            />
            <StatusBadge
              type="price"
              value={`~${card.price} VND`}
              icon={<DollarSign size={14} />}
            />
            <StatusBadge
              type="distance"
              value={card.distance}
              icon={<Navigation size={14} />}
            />
          </Row>

          {/* Mini Reviews */}
          <Column style={{ gap: spacing.xs }}>
            <Text
              style={{
                color: text.muted,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Top Reviews
            </Text>
            <Text
              style={{
                color: text.tertiary,
                fontSize: "0.75rem",
                lineHeight: 1.4,
              }}
            >
              &ldquo;Absolutely incredible, best in the area!&rdquo; —
              ⭐⭐⭐⭐⭐
            </Text>
            <Text
              style={{
                color: text.tertiary,
                fontSize: "0.75rem",
                lineHeight: 1.4,
              }}
            >
              &ldquo;Must visit spot, don&apos;t miss it.&rdquo; — ⭐⭐⭐⭐
            </Text>
          </Column>

          {/* Flip hint */}
          <Text
            style={{
              color: text.disabled,
              fontSize: "0.65rem",
              textAlign: "center",
              marginTop: "auto",
            }}
          >
            Double-tap to flip back
          </Text>
        </Column>
      </div>
    </motion.div>
  );
}
