"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecommendations";
import {
  Row,
  Column,
  Heading,
  Text,
} from "@/components/OnceUI";
import { Sparkles } from "lucide-react";
import { ContextCard } from "@/components/cards/ContextCard";
import { getDynamicContext } from "@/utils/dashboard-utils";

export const ContextualNavigator = () => {
  const ctx = getDynamicContext();
  const { picks, loading, error } = useRecommendations(5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
    >
      <Column fillWidth style={{ gap: "16px" }}>
        <Row
          fillWidth
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Row style={{ alignItems: "center", gap: "10px" }}>
            {ctx.icon}
            <Heading
              variant="heading-strong-l"
              weight="strong"
              style={{ color: "#1C1C1E" }}
            >
              {ctx.title}
            </Heading>
            <Row style={{ gap: "6px", marginLeft: "8px" }}>
              {ctx.tags.map((tag, tagIdx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3 + tagIdx * 0.06,
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -2,
                    boxShadow: `0 4px 16px ${ctx.accent}25`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    backgroundColor: `${ctx.accent}15`,
                    borderTopWidth: "1px",
                    borderBottomWidth: "1px",
                    borderLeftWidth: "1px",
                    borderRightWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `${ctx.accent}30`,
                    borderRadius: "6px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: ctx.accent,
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </Row>
          </Row>
          <Row
            onClick={() => { }}
            style={{
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Sparkles size={14} color={ctx.accent} />
            <Text
              style={{
                color: ctx.accent,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              AI Picks
            </Text>
          </Row>
        </Row>
        <Row
          className="no-scrollbar"
          fillWidth
          style={{
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {loading ? (
            <Text style={{ color: ctx.accent, padding: "20px" }}>Loading recommendations...</Text>
          ) : error ? (
            <Text style={{ color: "red", padding: "20px" }}>{error}</Text>
          ) : picks.length > 0 ? (
            picks.map((pick, i) => (
              <ContextCard
                key={pick.place_id}
                title={pick.name}
                subtitle={`${pick.price_range || "$$"} • Top Pick`}
                match={Math.round(pick.match_score)}
                accent={ctx.accent}
                img={pick.image_url || "https://images.unsplash.com/photo-1542181961-9590d0c79b27?w=400&h=250&fit=crop"}
                delay={i * 0.05}
              />
            ))
          ) : (
            <Text style={{ color: ctx.accent, padding: "20px" }}>No recommendations found</Text>
          )}
        </Row>
      </Column>
    </motion.div>
  );
};
