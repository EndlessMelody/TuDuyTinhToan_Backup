"use client";

import React from "react";
import { motion } from "framer-motion";
import { Row, Column, Heading, Text, Button } from "@/components/OnceUI";

const PARTNER = {
  pill: "🤝 Đối Tác Chính Thức",
  partnerName: "ShopeeFood",
  partnerLogo: "🛵",
  headline: "Đặt món ngay,\nnhận hoàn tiền 30%",
  subline:
    "Áp dụng cho tất cả nhà hàng được TasteMap AI gợi ý. Ưu đãi có hạn — chỉ dành cho thành viên.",
  cta: "Nhận Ưu Đãi Ngay",
  ctaSub: "Không cần mã giảm giá • Tự động áp dụng",
  badge1: { icon: "⚡", text: "Giao trong 25 phút" },
  badge2: { icon: "🔒", text: "Thanh toán an toàn" },
  badge3: { icon: "⭐", text: "4.9 • 120K đánh giá" },
  accentColor: "#FF6330",      // ShopeeFood orange
  accentColorDark: "#D94F20",
  secondaryColor: "#FF9B6A",
};

export const TasteMapProBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #0F0F13 0%, #1A1A24 40%, #12121A 100%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.06) inset",
          minHeight: "240px",
          cursor: "pointer",
        }}
        onClick={() => window.open("https://shopeefood.vn", "_blank")}
      >
        {/* ── Decorative Orbs ── */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "5%",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${PARTNER.accentColor}28 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "25%",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: `radial-gradient(circle, #7B2FF720 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "38%",
            transform: "translateY(-50%)",
            width: "1px",
            height: "70%",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* ── Grid Lines Texture ── */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.04,
            pointerEvents: "none",
          }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* ── Main Content Layout ── */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            position: "relative",
            zIndex: 10,
            minHeight: "240px",
          }}
        >
          {/* LEFT — Text Section */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
              padding: "40px 40px 40px 44px",
              minWidth: 0,
            }}
          >
            {/* Partner Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "100px",
                  padding: "4px 12px 4px 8px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PARTNER.accentColor}, ${PARTNER.accentColorDark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                  }}
                >
                  {PARTNER.partnerLogo}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                  }}
                >
                  {PARTNER.pill}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.8px",
                }}
              >
                {PARTNER.headline.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {i === 1 ? (
                      <span
                        style={{
                          background: `linear-gradient(90deg, ${PARTNER.accentColor}, ${PARTNER.secondaryColor})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {line}
                      </span>
                    ) : (
                      line
                    )}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            </div>

            {/* Subline */}
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                maxWidth: "340px",
                fontWeight: 400,
              }}
            >
              {PARTNER.subline}
            </p>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: `linear-gradient(135deg, ${PARTNER.accentColor} 0%, ${PARTNER.accentColorDark} 100%)`,
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 28px",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 8px 24px ${PARTNER.accentColor}40`,
                  letterSpacing: "0.2px",
                  whiteSpace: "nowrap",
                }}
              >
                {PARTNER.cta}
              </motion.button>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {PARTNER.ctaSub}
              </span>
            </div>
          </div>

          {/* RIGHT — Stats / Trust Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "12px",
              padding: "40px 44px",
              flexShrink: 0,
            }}
          >
            {/* Partner Logo Big */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "22px",
                background: `linear-gradient(135deg, ${PARTNER.accentColor}22, ${PARTNER.accentColor}08)`,
                border: `1px solid ${PARTNER.accentColor}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.4rem",
                marginBottom: "8px",
                backdropFilter: "blur(10px)",
              }}
            >
              {PARTNER.partnerLogo}
            </div>

            {[PARTNER.badge1, PARTNER.badge2, PARTNER.badge3].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "7px 14px",
                  backdropFilter: "blur(10px)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>{badge.icon}</span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {badge.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom Disclaimer Bar ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "10px 44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>
            * Ưu đãi có giới hạn số lượng. Áp dụng cho đơn từ 50.000 VNĐ. Xem điều khoản tại ShopeeFood.
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.7rem",
            }}
          >
            <span>Được xác minh bởi</span>
            <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>TasteMap</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
