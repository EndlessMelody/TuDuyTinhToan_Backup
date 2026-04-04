"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const STATS = [
  { value: "94%",  label: "Taste accuracy",    sub: "AI-matched recommendations" },
  { value: "2.4K", label: "Active foodies",     sub: "Monthly active users"       },
  { value: "12+",  label: "Months of taste",    sub: "Average profile depth"      },
];

const TESTIMONIALS = [
  {
    text: "TasteMap found me a hidden sushi spot I walk past every day but never noticed. The match score was 97% — they weren't wrong.",
    name: "Ramona Flowers",
    handle: "@ramona.eats",
    avatar: "🧑‍🍳",
    color: "hsl(210,60%,72%)",
  },
  {
    text: "I connected with 3 foodies in my area who love spicy food as much as I do. We built a whole Bún Bò tour together.",
    name: "Hùng Đặt",
    handle: "@hungdat.food",
    avatar: "👨‍🍳",
    color: "hsl(30,60%,72%)",
  },
  {
    text: "The Tour Builder is insane. Drag-to-build a food route with distance and pricing baked in? That's the feature I didn't know I needed.",
    name: "Thảo Vy",
    handle: "@thaovy.vibes",
    avatar: "👩‍🍳",
    color: "hsl(340,60%,72%)",
  },
];

export function PromoSocialProof() {
  return (
    <section style={{ backgroundColor: "white", padding: "88px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#007AFF", textTransform: "uppercase", letterSpacing: "1.2px" }}>
            Community
          </p>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, letterSpacing: "-1.2px", color: "#1C1C1E" }}>
            We&apos;ve helped foodies discover amazing places
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(0,0,0,0.45)", maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            From solo explorers to group dinner planners — TasteMap powers every type of food journey.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, marginBottom: 52, backgroundColor: "rgba(0,0,0,0.06)", borderRadius: 16, overflow: "hidden" }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "32px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center", borderRadius: i === 0 ? "16px 0 0 16px" : i === 2 ? "0 16px 16px 0" : 0 }}>
              <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2.5px", color: "#1C1C1E", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>{s.label}</span>
              <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>{s.sub}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ backgroundColor: "#F8F8FA", borderRadius: 16, padding: "24px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#FBBF24" color="#FBBF24" />)}
              </div>
              {/* Quote */}
              <p style={{ margin: 0, fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.65, flex: 1 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>{t.handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
