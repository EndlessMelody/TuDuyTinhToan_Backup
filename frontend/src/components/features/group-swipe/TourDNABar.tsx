"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna } from "lucide-react";

/**
 * TourDNABar — A simple progress bar showing how much the Group Vector
 * has evolved from the initial state (all 0.5). User approved: basic bar only,
 * no radar chart.
 */

// Dimension labels (15-dim vector) for hover tooltips
const DIMENSION_LABELS = [
  "Price",
  "Noise",
  "Nature",
  "Cuisine",
  "Modern",
  "Spicy",
  "Sweet",
  "Portion",
  "Ambiance",
  "Service",
  "Distance",
  "Rating",
  "Freshness",
  "Vibe",
  "Variety",
];

interface TourDNABarProps {
  groupVector: number[];
}

export function TourDNABar({ groupVector }: TourDNABarProps) {
  const prevVectorRef = useRef<number[]>([]);
  const [delta, setDelta] = useState(0);

  // Calculate how much the vector has changed from default (0.5 baseline)
  useEffect(() => {
    if (groupVector.length === 0) return;

    const baseline = 0.5;
    let totalShift = 0;
    for (const v of groupVector) {
      totalShift += Math.abs(v - baseline);
    }
    // Normalize to 0-100 (max shift per dim is 0.5, so max total is 0.5 * N)
    const maxShift = 0.5 * groupVector.length;
    const pct = Math.min((totalShift / maxShift) * 100, 100);
    setDelta(pct);
    prevVectorRef.current = groupVector;
  }, [groupVector]);

  if (groupVector.length === 0) return null;

  const label =
    delta < 15
      ? "Exploring..."
      : delta < 40
        ? "Learning preferences"
        : delta < 70
          ? "Profile taking shape"
          : "Strong group identity!";

  return (
    <div
      style={{
        padding: "12px 16px",
        background:
          "linear-gradient(135deg, rgba(255,107,53,0.06), rgba(255,107,53,0.02))",
        borderRadius: 14,
        border: "1px solid rgba(255,107,53,0.12)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dna size={13} style={{ color: "#ff6b35" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8E8E93",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Tour DNA
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#ff6b35",
          }}
        >
          {Math.round(delta)}% evolved
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${delta}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            borderRadius: 3,
            background: "linear-gradient(90deg, #ff6b35, #FF9500)",
            boxShadow: "0 0 8px rgba(255,107,53,0.4)",
          }}
        />
      </div>

      {/* Status label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          style={{
            fontSize: 11,
            color: "#AEAEB2",
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* Mini dimension bars — shows top 5 most shifted dims */}
      {groupVector.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 4,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {groupVector
            .map((v, i) => ({
              index: i,
              shift: Math.abs(v - 0.5),
              value: v,
              label: DIMENSION_LABELS[i] ?? `D${i}`,
            }))
            .sort((a, b) => b.shift - a.shift)
            .slice(0, 5)
            .map((dim) => (
              <div
                key={dim.index}
                title={`${dim.label}: ${(dim.value * 100).toFixed(0)}%`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 6px",
                  borderRadius: 6,
                  backgroundColor: "rgba(255,107,53,0.08)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                <span>{dim.label}</span>
                <div
                  style={{
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,107,53,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value * 100}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      backgroundColor: "#ff6b35",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
