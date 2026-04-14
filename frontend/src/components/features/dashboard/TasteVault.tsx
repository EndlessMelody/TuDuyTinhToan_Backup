"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Row, Column, Heading, IconButton } from "@/components/OnceUI";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { VaultCard } from "@/components/cards/VaultCard";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Text } from "@/components/OnceUI";

export const TasteVault = () => {
  const vaultRef = useRef<HTMLDivElement>(null);
  const { picks, loading, error } = useRecommendations(6, undefined, "food");

  const scrollVault = (direction: "left" | "right") => {
    if (vaultRef.current) {
      vaultRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
    >
      <Column fillWidth style={{ gap: "20px" }}>
        <Row
          fillWidth
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Row style={{ alignItems: "center", gap: "10px" }}>
            <Bookmark size={20} color="#FBBF24" />
            <Heading
              variant="heading-strong-l"
              weight="strong"
              style={{ color: "#1C1C1E" }}
            >
              The Taste Vault
            </Heading>
          </Row>
          <Row style={{ gap: "8px" }}>
            <IconButton
              icon={<ChevronLeft size={18} color="#636366" />}
              onClick={() => scrollVault("left")}
              style={{
                backgroundColor: "#F2F2F7",
                borderRadius: "10px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            />
            <IconButton
              icon={<ChevronRight size={18} color="#636366" />}
              onClick={() => scrollVault("right")}
              style={{
                backgroundColor: "#F2F2F7",
                borderRadius: "10px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            />
          </Row>
        </Row>
        <Row
          ref={vaultRef}
          className="no-scrollbar"
          fillWidth
          style={{
            overflowX: "auto",
            gap: "16px",
            paddingBottom: "8px",
          }}
        >
          {loading ? (
            <Text style={{ color: "#8E8E93", padding: "20px" }}>Loading foods...</Text>
          ) : error ? (
            <Text style={{ color: "red", padding: "20px" }}>{error}</Text>
          ) : picks.length > 0 ? (
            picks.map((pick, i) => {
              const matchPct = pick.match_score > 1 ? pick.match_score : pick.match_score * 100;
              return (
                <VaultCard
                  key={pick.place_id}
                  title={pick.name}
                  xp={`${Math.round(matchPct)}XP`}
                  img={pick.image_url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=520&h=360&fit=crop"}
                  tags={pick.price_range ? `Food • ${pick.price_range}` : "Recommended Food"}
                  rating={Number(Math.min(5, Math.max(3.8, matchPct / 20)).toFixed(1))}
                  delay={i * 0.05}
                />
              )
            })
          ) : (
            <Text style={{ color: "#8E8E93", padding: "20px" }}>No recommended foods found.</Text>
          )}
        </Row>
      </Column>
    </motion.div>
  );
};
