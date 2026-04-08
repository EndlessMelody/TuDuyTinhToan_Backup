import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Row, Column, Heading, IconButton } from "@/components/OnceUI";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { VaultCard } from "@/components/cards/VaultCard";

export const TasteVault = () => {
  const vaultRef = useRef<HTMLDivElement>(null);

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
          <div style={{ flexShrink: 0 }}>
            <VaultCard
              title="Banh Mi Pho 古"
              xp="10XP"
              img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=520&h=360&fit=crop"
              tags="Vietnamese • Street Food"
              rating={4.8}
              delay={0.05}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <VaultCard
              title="Neon Diner"
              xp="15XP"
              img="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=520&h=360&fit=crop"
              tags="American • Retro"
              rating={4.2}
              delay={0.1}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <VaultCard
              title="Matcha Room"
              xp="30XP"
              img="https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=520&h=360&fit=crop"
              tags="Japanese • Cafe"
              rating={4.6}
              delay={0.15}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <VaultCard
              title="Sky Bar"
              xp="10XP"
              img="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=520&h=360&fit=crop"
              tags="Cocktails • View"
              rating={4.4}
              delay={0.2}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <VaultCard
              title="Phở Sáng"
              xp="20XP"
              img="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=520&h=360&fit=crop"
              tags="Vietnamese • Breakfast"
              rating={4.9}
              delay={0.25}
            />
          </div>
        </Row>
      </Column>
    </motion.div>
  );
};
