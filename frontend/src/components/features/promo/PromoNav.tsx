"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Foodies", href: "#why" },
  { label: "Pricing", href: "#plans" },
  { label: "About", href: "#footer" },
];

export function PromoNav() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "white",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(0,0,0,0.06)"
          : "1px solid rgba(0,0,0,0.06)",
        transition: "background-color 0.2s, backdrop-filter 0.2s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1A7AFF, #5856D6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin size={15} color="white" />
          </div>
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#1C1C1E",
            }}
          >
            TasteMap<span style={{ color: "#4F8EF7" }}>.</span>
          </span>
        </div>

        {/* Desktop links */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: 4 }}
          className="promo-desktop-nav"
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(0,0,0,0.55)",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#1C1C1E";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(0,0,0,0.55)";
                (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isLoggedIn && (
            <button
              onClick={() => router.push("/login")}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(0,0,0,0.55)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#1C1C1E";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(0,0,0,0.55)";
              }}
            >
              Login
            </button>
          )}
          <button
            onClick={() => router.push("/discover")}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "white",
              boxShadow: "0 2px 10px rgba(0,100,255,0.25)",
              transition: "box-shadow 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(0,100,255,0.35)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 10px rgba(0,100,255,0.25)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            {isLoggedIn ? "Open App →" : "Start →"}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              padding: 6,
              borderRadius: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            className="promo-mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            padding: "12px 24px 20px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 500,
                color: "#1C1C1E",
                textAlign: "left",
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => router.push("/discover")}
            style={{
              marginTop: 8,
              padding: "12px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              color: "white",
            }}
          >
            Get Started →
          </button>
        </div>
      )}
    </motion.nav>
  );
}
