"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";

export function PromoCTA() {
  const router = useRouter();

  return (
    <section style={{ backgroundColor: "#0D1117", padding: "88px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            padding: "64px 56px",
            background: "linear-gradient(135deg, #0D2A5C 0%, #1A1A40 50%, #1C0A2E 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(175,82,222,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            {/* Left text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "rgba(79,142,247,0.8)", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                Get started today
              </p>
              <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.15, color: "white" }}>
                Ready to level up your food experience?
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                Join thousands of foodies already mapping their taste, building tours, and discovering restaurants they actually love.
              </p>
            </div>

            {/* Right CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
              <button
                onClick={() => router.push("/discover")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "15px 28px",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
                  border: "none", cursor: "pointer",
                  color: "white", fontSize: 15, fontWeight: 700,
                  boxShadow: "0 8px 28px rgba(0,100,255,0.35)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,100,255,0.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,100,255,0.35)"; }}
              >
                <Compass size={17} />
                Start Discovering
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => router.push("/discover")}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 14, fontWeight: 500,
                  transition: "color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              >
                Learn more →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
