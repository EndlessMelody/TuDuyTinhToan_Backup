"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import { LoginForm } from "@/components/features/auth/LoginForm";

const PERKS = [
  "AI-matched restaurants ranked by your palate",
  "Connect with foodies who share your taste",
  "Build drag-to-route food tours in seconds",
  "Group rooms to plan dinners together, live",
];

const AVATARS = [
  { emoji: "", bg: "hsl(210,60%,55%)" },
  { emoji: "", bg: "hsl(30,60%,55%)" },
  { emoji: "", bg: "hsl(160,50%,50%)" },
  { emoji: "", bg: "hsl(340,55%,55%)" },
];

const FOOD_FLOATS = [
  { emoji: "", top: "12%", right: "8%" },
  { emoji: "", top: "45%", right: "4%" },
  { emoji: "", bottom: "18%", right: "10%" },
];

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #07101F 0%, #0C1A3B 50%, #08091A 100%)",
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          LEFT — Branding panel
      ════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 44%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 48px",
        }}
      >
        {/* Glow blobs (left panel) */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-20%",
            left: "-20%",
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(26,122,255,0.22) 0%, transparent 68%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-10%",
            width: "65%",
            height: "65%",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(130,60,220,0.18) 0%, transparent 68%)",
          }}
        />

        {/* Floating food emojis */}
        {FOOD_FLOATS.map(({ emoji, ...pos }, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -16, 0],
              rotate: [-5, 5, -5],
              opacity: [0.12, 0.25, 0.12],
            }}
            transition={{
              duration: 5 + i * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            style={{
              position: "absolute",
              fontSize: 28,
              pointerEvents: "none",
              filter: "blur(0.5px)",
              ...pos,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1A7AFF, #5856D6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 22px rgba(26,122,255,0.45)",
            }}
          >
            <MapPin size={16} color="white" />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            TasteMap<span style={{ color: "#4F8EF7" }}>.</span>
          </span>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 12px",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1.08,
                color: "white",
                fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
              }}
            >
              Your flavour DNA,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #4F8EF7, #AF52DE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                mapped.
              </span>
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "rgba(255,255,255,0.42)",
                lineHeight: 1.65,
                maxWidth: 340,
              }}
            >
              Sign in to unlock personalised recommendations, food tours, and a
              community that shares your taste.
            </p>
          </div>

          {/* Perks */}
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {PERKS.map((perk, i) => (
              <motion.li
                key={perk}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.38 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 1,
                    background: "rgba(79,142,247,0.15)",
                    border: "1px solid rgba(79,142,247,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={10} color="#4F8EF7" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {perk}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              maxWidth: 320,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                flexShrink: 0,
                background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            ></div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                  Neo-Tokyo Sushi
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#FBBF24" }}
                >
                  97% match
                </span>
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                0.8 km · Japanese · $$$
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex" }}>
            {AVATARS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: a.bg,
                  border: "2px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  marginLeft: i === 0 ? 0 : -7,
                }}
              >
                {a.emoji}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.32)" }}>
            Joined by{" "}
            <strong
              style={{ color: "rgba(255,255,255,0.58)", fontWeight: 600 }}
            >
              2,400+ foodies
            </strong>
          </span>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RIGHT — Glass form panel
      ════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 40px",
        }}
      >
        {/* Subtle right-side blobs */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            top: "-10%",
            right: "-15%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(88,86,214,0.2) 0%, transparent 68%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(26,122,255,0.15) 0%, transparent 68%)",
          }}
        />

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 420,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(56px) saturate(180%)",
            WebkitBackdropFilter: "blur(56px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 26,
            boxShadow: [
              "0 24px 72px rgba(0,0,0,0.5)",
              "0 0 0 1px rgba(255,255,255,0.04)",
              "inset 0 1px 0 rgba(255,255,255,0.1)",
              "inset 0 -1px 0 rgba(0,0,0,0.12)",
            ].join(", "),
            padding: "32px 36px 28px",
            /* allow internal scroll on very short screens */
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
          }}
        >
          {/* top shine line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
