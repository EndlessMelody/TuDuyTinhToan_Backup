"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const TRUST_LOGOS = [
  { name: "Klarna", emoji: "🍜" },
  { name: "Coinbase", emoji: "🍣" },
  { name: "Instacart", emoji: "🌮" },
  { name: "Shopify", emoji: "🍕" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

function AppMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 380,
        marginLeft: "auto",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: -32,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,122,255,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "white",
          borderRadius: 20,
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>
            Your TasteMap
          </span>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: "rgba(52,199,89,0.1)",
              border: "1px solid rgba(52,199,89,0.2)",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>
              ● Online
            </span>
          </div>
        </div>

        {/* Match score hero */}
        <div
          style={{
            padding: "20px 18px 16px",
            background: "linear-gradient(135deg, #1A7AFF10, #5856D610)",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(0,0,0,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Taste Match Score
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: "-2px",
                color: "#1C1C1E",
                lineHeight: 1,
              }}
            >
              94%
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#34C759",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              ▲ +3.2%
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 6,
              borderRadius: 6,
              backgroundColor: "rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "94%",
                height: "100%",
                borderRadius: 6,
                background: "linear-gradient(90deg, #1A7AFF, #5856D6)",
              }}
            />
          </div>
        </div>

        {/* Venue card */}
        <div
          style={{
            margin: "12px 18px",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              height: 90,
              background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🍣
          </div>
          <div
            style={{
              padding: "10px 14px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1C1C1E",
                }}
              >
                Neo-Tokyo Sushi
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(0,0,0,0.4)" }}>
                0.8km · $$$ · Japanese
              </p>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} fill="#FBBF24" color="#FBBF24" />
              ))}
            </div>
          </div>
        </div>

        {/* Foodies strip */}
        <div
          style={{
            padding: "0 18px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex" }}>
              {["🧑‍🍳", "👩‍🍳", "🍱"].map((e, i) => (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: `hsl(${i * 60 + 180},60%,70%)`,
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
            <span
              style={{
                fontSize: 12,
                color: "rgba(0,0,0,0.5)",
                fontWeight: 500,
              }}
            >
              +24 foodies nearby
            </span>
          </div>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
            }}
          >
            Explore
          </button>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          backgroundColor: "white",
          borderRadius: 14,
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 18 }}>✨</span>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#1C1C1E",
            }}
          >
            New Match!
          </p>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(0,0,0,0.4)" }}>
            Ramona Flowers · 94%
          </p>
        </div>
      </motion.div>

      {/* Floating tour badge */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          bottom: -14,
          left: -14,
          backgroundColor: "white",
          borderRadius: 14,
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 18 }}>🗺️</span>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#1C1C1E",
            }}
          >
            Tour Ready
          </p>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(0,0,0,0.4)" }}>
            5 venues · 3.2km
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PromoHero() {
  const router = useRouter();

  return (
    <section style={{ backgroundColor: "white", padding: "72px 0 80px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* ── Left copy ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* AI badge */}
          <motion.div {...fadeUp(0.05)}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 14px",
                borderRadius: 20,
                backgroundColor: "rgba(0,122,255,0.07)",
                border: "1px solid rgba(0,122,255,0.15)",
              }}
            >
              <Sparkles size={12} color="#007AFF" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#007AFF",
                  letterSpacing: "0.2px",
                }}
              >
                AI-powered food discovery
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.12)}
            style={{
              margin: 0,
              fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
              fontWeight: 900,
              letterSpacing: "-2.5px",
              lineHeight: 1.05,
              color: "#1C1C1E",
            }}
          >
            Discover food,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #007AFF, #5856D6, #AF52DE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              save automatically,
            </span>{" "}
            eat your way.
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            style={{
              margin: 0,
              fontSize: 16,
              color: "rgba(0,0,0,0.5)",
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            TasteMap maps your flavour DNA, matches you with the right venues
            and foodies, and builds food tours you&apos;ll actually want to go
            on.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.27)}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <button
              onClick={() => router.push("/discover")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
                border: "none",
                cursor: "pointer",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                boxShadow: "0 6px 20px rgba(0,100,255,0.3)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 10px 28px rgba(0,100,255,0.38)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 20px rgba(0,100,255,0.3)";
              }}
            >
              Get Started <ArrowRight size={15} />
            </button>
            <button
              onClick={() => router.push("/discover")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: 12,
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
                cursor: "pointer",
                color: "#1C1C1E",
                fontSize: 15,
                fontWeight: 600,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,122,255,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,0,0,0.1)";
              }}
            >
              Explore Demo
            </button>
          </motion.div>

          {/* Trust logos */}
          <motion.div {...fadeUp(0.34)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {TRUST_LOGOS.map((t) => (
                <div
                  key={t.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: 0.5,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{t.emoji}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1C1C1E",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right mockup ── */}
        <AppMockup />
      </div>
    </section>
  );
}
