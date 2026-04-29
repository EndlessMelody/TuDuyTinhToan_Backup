"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Star, Users } from "lucide-react";
import type { FinishResult } from "@/hooks/useGroupSwipe";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop";

interface GroupResultsViewProps {
  results: FinishResult[];
}

export function GroupResultsView({ results }: GroupResultsViewProps) {
  if (results.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: "center",
          padding: "24px 20px 16px",
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 12,
            delay: 0.2,
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(255,149,0,0.2), rgba(255,204,2,0.1))",
            border: "1px solid rgba(255,149,0,0.3)",
          }}
        >
          <Trophy size={30} style={{ color: "#FF9500" }} />
        </motion.div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1C1C1E",
            letterSpacing: "-0.02em",
          }}
        >
          Tour Revealed! 🎉
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#8E8E93",
            marginTop: 4,
          }}
        >
          Here are the top picks the Minimax Referee chose for your group.
        </p>
      </motion.div>

      {/* Results list */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {results.map((place, idx) => (
          <motion.div
            key={place.location_id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.3 + idx * 0.12,
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
            style={{
              display: "flex",
              gap: 14,
              padding: 14,
              borderRadius: 18,
              backgroundColor: idx === 0 ? "#FFFBF0" : "#FAFAFA",
              border:
                idx === 0
                  ? "1.5px solid rgba(255,149,0,0.3)"
                  : "1px solid #F2F2F7",
              boxShadow:
                idx === 0 ? "0 4px 20px rgba(255,149,0,0.12)" : "none",
            }}
          >
            {/* Rank */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background:
                  idx === 0
                    ? "linear-gradient(135deg, #FF9500, #FFCC02)"
                    : idx === 1
                      ? "linear-gradient(135deg, #C7C7CC, #E5E5EA)"
                      : idx === 2
                        ? "linear-gradient(135deg, #CD7F32, #DFA76B)"
                        : "#F2F2F7",
                color: idx < 3 ? "#fff" : "#8E8E93",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {idx + 1}
            </div>

            {/* Image */}
            <img
              src={place.image_url || FALLBACK_IMG}
              alt={place.name}
              style={{
                width: 72,
                height: 72,
                borderRadius: 14,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1C1C1E",
                  letterSpacing: "-0.01em",
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {place.name}
              </h4>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {/* Group score */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#FF9500",
                    backgroundColor: "rgba(255,149,0,0.1)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  <Star size={10} fill="#FF9500" />
                  {Math.round(place.group_score)}% match
                </span>

                {/* Vault badge */}
                {place.in_vault && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#6366F1",
                      backgroundColor: "rgba(99,102,241,0.1)",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    <Users size={9} />
                    In Vault
                  </span>
                )}
              </div>

              {/* Member scores */}
              {place.member_scores && place.member_scores.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginTop: 6,
                    flexWrap: "wrap",
                  }}
                >
                  {place.member_scores.map((ms) => (
                    <span
                      key={ms.user_id}
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: "#AEAEB2",
                        backgroundColor: "#F2F2F7",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      User {ms.user_id}: {Math.round(ms.score)}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
