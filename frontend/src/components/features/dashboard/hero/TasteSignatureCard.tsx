"use client";

/**
 * TasteSignatureCard — Discover v2
 * ─────────────────────────────────────────────────────────────────
 * The "magic moment" of the hero: a hand-rolled SVG radar chart that
 * visualizes the user's taste preferences as a 6-axis polygon.
 *
 * Data source: `useUserVector().radarData` — already shaped as
 *   [{ subject, A, fullMark }, ...] for 6 traits.
 *
 * Design:
 *   - Concentric grid rings at 25%, 50%, 75%, 100%
 *   - Axis lines from center to each vertex
 *   - Filled polygon using the signature gradient
 *   - "Pulse" ring when vector updates (isPulsing)
 *   - Top-2 dominant traits listed below as chips
 *
 * No chart library — everything is pure SVG + CSS for zero dependency
 * cost and full theme-ability.
 */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { GlassCard } from "@/components/primitives";
import { tokens } from "@/styles/tokens";
import { useUserVector } from "@/context/UserVectorContext";

// ─── Layout constants ─────────────────────────────────────
const CHART_SIZE = 120;
const CENTER = CHART_SIZE / 2;
const RADIUS = CHART_SIZE / 2 - 16; // leave room for axis labels

// ─── Helpers ─────────────────────────────────────────────────────
/** Convert (axisIndex, value 0-1) → {x, y} on the radar */
function polarToCartesian(
  axisIndex: number,
  axisCount: number,
  value: number, // 0-1
): { x: number; y: number } {
  const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / axisCount;
  const r = value * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

/** Build the "d" attribute of the data polygon path */
function buildPath(
  values: number[], // array of 0-1 values
): string {
  if (!values.length) return "";
  const pts = values.map((v, i) => polarToCartesian(i, values.length, v));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return `${d} Z`;
}

// ─── Main component ──────────────────────────────────────────────
export const TasteSignatureCard: React.FC = () => {
  const { radarData, isPulsing } = useUserVector();

  // Normalize to 0-1
  const values = useMemo(
    () => radarData.map((d) => Math.max(0, Math.min(1, d.A / d.fullMark))),
    [radarData],
  );

  // Top-1 trait by value (shown inline in header to save vertical space)
  const topTrait = useMemo(() => {
    return [...radarData].sort(
      (a, b) => b.A / b.fullMark - a.A / a.fullMark,
    )[0];
  }, [radarData]);

  const axisCount = radarData.length;
  const polygonPath = useMemo(() => buildPath(values), [values]);

  // Grid polygons at 25/50/75/100%
  const gridRings = useMemo(() => {
    return [0.25, 0.5, 0.75, 1].map((level) => {
      const pts = Array.from({ length: axisCount }, (_, i) =>
        polarToCartesian(i, axisCount, level),
      );
      return (
        pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
        " Z"
      );
    });
  }, [axisCount]);

  return (
    <GlassCard
      variant="elevated"
      padding="sm"
      radius="lg"
      fillWidth
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.space[2],
        flex: 1,
        minHeight: 0,
        paddingLeft: tokens.space[4],
        paddingRight: tokens.space[4],
      }}
    >
      {/* ── Header (with inline top-trait chip) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: tokens.space[2],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.space[2],
            minWidth: 0,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: tokens.radius.sm,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: tokens.gradient.signatureSoft,
              border: `1px solid ${tokens.color.border}`,
              flexShrink: 0,
            }}
          >
            <Sparkles size={12} color={tokens.color.magic} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontSize: tokens.type.size.caption,
              fontWeight: tokens.type.weight.bold,
              letterSpacing: tokens.type.tracking.wide,
              textTransform: "uppercase",
              color: tokens.color.textSubtle,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Taste Signature
          </span>
        </div>

        {topTrait && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: tokens.space[2],
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: tokens.space[2],
              paddingRight: tokens.space[3],
              borderRadius: tokens.radius.pill,
              backgroundColor: tokens.color.surfaceMuted,
              border: `1px solid ${tokens.color.border}`,
              fontSize: 10,
              fontWeight: tokens.type.weight.bold,
              color: tokens.color.text,
              letterSpacing: tokens.type.tracking.normal,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundImage: tokens.gradient.signature,
                flexShrink: 0,
              }}
            />
            {topTrait.subject}
            <span
              style={{
                color: tokens.color.textMuted,
                fontWeight: tokens.type.weight.medium,
              }}
            >
              {Math.round((topTrait.A / topTrait.fullMark) * 100)}%
            </span>
          </span>
        )}
      </div>

      {/* ── Radar + labels ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: CHART_SIZE,
            height: CHART_SIZE,
          }}
        >
          <svg
            width={CHART_SIZE}
            height={CHART_SIZE}
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            style={{ display: "block", overflow: "visible" }}
            aria-label="Taste signature radar chart"
            role="img"
          >
            <defs>
              <linearGradient
                id="tm-signature-fill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#e63946" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient
                id="tm-signature-stroke"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="50%" stopColor="#e63946" />
                <stop offset="100%" stopColor="#7b2ff7" />
              </linearGradient>
            </defs>

            {/* Grid rings */}
            {gridRings.map((d, i) => (
              <path
                key={`ring-${i}`}
                d={d}
                fill="none"
                stroke={tokens.color.border}
                strokeWidth={1}
              />
            ))}

            {/* Axis lines */}
            {Array.from({ length: axisCount }).map((_, i) => {
              const p = polarToCartesian(i, axisCount, 1);
              return (
                <line
                  key={`axis-${i}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={p.x}
                  y2={p.y}
                  stroke={tokens.color.border}
                  strokeWidth={1}
                />
              );
            })}

            {/* Data polygon */}
            <motion.path
              d={polygonPath}
              fill="url(#tm-signature-fill)"
              stroke="url(#tm-signature-stroke)"
              strokeWidth={2}
              strokeLinejoin="round"
              initial={false}
              animate={{
                d: polygonPath,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* Vertex dots */}
            {values.map((v, i) => {
              const p = polarToCartesian(i, axisCount, v);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={tokens.color.surface}
                  stroke="url(#tm-signature-stroke)"
                  strokeWidth={2}
                />
              );
            })}

            {/* Axis labels */}
            {radarData.map((d, i) => {
              const labelRadius = RADIUS + 10;
              const angle = -Math.PI / 2 + (i * 2 * Math.PI) / axisCount;
              const x = CENTER + labelRadius * Math.cos(angle);
              const y = CENTER + labelRadius * Math.sin(angle);
              // Anchor based on angle
              const isTop = Math.abs(angle + Math.PI / 2) < 0.01;
              const isBottom = Math.abs(angle - Math.PI / 2) < 0.01;
              const textAnchor =
                isTop || isBottom
                  ? "middle"
                  : Math.cos(angle) > 0
                    ? "start"
                    : "end";
              return (
                <text
                  key={`label-${i}`}
                  x={x}
                  y={y}
                  fontSize={9}
                  fontWeight={700}
                  fill={tokens.color.textMuted}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  style={{
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                  }}
                >
                  {d.subject}
                </text>
              );
            })}
          </svg>

          {/* Pulse overlay when vector changes */}
          {isPulsing && (
            <motion.div
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: `2px solid ${tokens.color.magic}`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};
