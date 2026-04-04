"use client";

import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Build your taste profile",
    desc: "Answer a short flavour quiz or let us learn from your first few swipes. TasteMap maps your palate across 8 taste dimensions.",
  },
  {
    num: "02",
    title: "Discover your matches",
    desc: "Get AI-ranked venues, tours, and foodies that align with your exact taste vector — updated in real time as you explore.",
  },
  {
    num: "03",
    title: "Go eat, together",
    desc: "Invite foodies, build a tour route, share your experiences. Your TasteMap grows with every meal you add to it.",
  },
];

export function PromoHowItWorks() {
  return (
    <section style={{ backgroundColor: "#0D1117", padding: "88px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 56 }}
        >
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: "rgba(79,142,247,0.8)", textTransform: "uppercase", letterSpacing: "1.2px" }}>
            How it works
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.15, color: "white", maxWidth: 520 }}>
            Start mapping your food story in minutes.
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{
                padding: "36px 32px",
                borderRadius: i === 0 ? "16px 0 0 16px" : i === 2 ? "0 16px 16px 0" : 0,
                backgroundColor: i === 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRight: i < 2 ? "none" : "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", gap: 20,
              }}
            >
              {/* Number pill */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: i === 1
                  ? "linear-gradient(135deg, #1A7AFF, #5856D6)"
                  : "rgba(255,255,255,0.06)",
                border: i === 1 ? "none" : "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: i === 1 ? "white" : "rgba(255,255,255,0.5)", letterSpacing: "-0.5px" }}>
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "-0.4px", lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
