import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Column, Heading, Text } from "@/components/OnceUI";
import { Sparkles, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { AI_PICKS } from "@/constants/mock-data";
import { SkeletonAIPicksCard } from "@/components/Skeletons";

const matchColor = (match: number) =>
  match >= 90 ? "#34C759" : match >= 75 ? "#FBBF24" : "#FF6B6B";

const cardVariants = {
  rest: { y: 0, scale: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  hover: { y: -10, scale: 1.02, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" },
};

const imgVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

interface AIPicksSectionProps {
  isLoading?: boolean;
}

export const AIPicksSection: React.FC<AIPicksSectionProps> = ({
  isLoading = false,
}) => {
  const router = useRouter();
  const [picks, setPicks] = React.useState([...AI_PICKS]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRotation((r) => r + 360);
    setTimeout(() => {
      setPicks((prev) => [...prev].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
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
            <Sparkles size={20} color="#A855F7" />
            <Heading
              variant="heading-strong-l"
              weight="strong"
              style={{ color: "#1C1C1E" }}
            >
              AI Picks For You
            </Heading>
          </Row>
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: isRefreshing ? "default" : "pointer",
              padding: "4px 8px",
              borderRadius: "8px",
              backgroundColor: "rgba(168,85,247,0.07)",
            }}
          >
            <motion.span
              animate={{ rotate: rotation }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ display: "inline-flex" }}
            >
              <RefreshCw size={13} color="#A855F7" />
            </motion.span>
            <span
              style={{ color: "#A855F7", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Refresh
            </span>
          </motion.button>
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
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", gap: "16px" }}
              >
                {[...Array(4)].map((_, i) => (
                  <SkeletonAIPicksCard key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", gap: "16px" }}
              >
                {picks.map((pick, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    initial={{ opacity: 0, scale: 0.9, y: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover="hover"
                    animate="rest"
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.08,
                      type: "spring",
                      stiffness: 100,
                    }}
                    onClick={() => router.push("/tour-builder")}
                    style={{
                      minWidth: "260px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      backgroundColor: "#FFFFFF",
                      borderTopWidth: "1px",
                      borderBottomWidth: "1px",
                      borderLeftWidth: "1px",
                      borderRightWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "140px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <motion.img
                        src={pick.img}
                        alt={pick.title}
                        variants={imgVariants}
                        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(to bottom, transparent 40%, ${pick.color}20 100%)`,
                        }}
                      />
                      <div
                        className="glass-premium"
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          borderRadius: "10px",
                          borderTopWidth: "1px",
                          borderBottomWidth: "1px",
                          borderLeftWidth: "1px",
                          borderRightWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "rgba(255,255,255,0.4)",
                          backgroundColor: "rgba(255,255,255,0.85)",
                        }}
                      >
                        <Text
                          style={{
                            color: matchColor(pick.match),
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {pick.match}% Match
                        </Text>
                      </div>
                    </div>
                    <Column
                      style={{
                        paddingTop: "16px",
                        paddingBottom: "16px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        gap: "8px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#1C1C1E",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {pick.title}
                      </Text>
                      <Row style={{ gap: "6px", alignItems: "center" }}>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: pick.color,
                            boxShadow: `0 0 8px ${pick.color}`,
                          }}
                        />
                        <Text
                          style={{
                            color: pick.color,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {pick.reason}
                        </Text>
                      </Row>
                      <Row
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <Text
                          style={{
                            color: "#8E8E93",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          From {pick.price} VND
                        </Text>
                        <div
                          style={{
                            padding: "4px",
                            borderRadius: "8px",
                            backgroundColor: "#F2F2F7",
                          }}
                        >
                          <Sparkles size={12} color="#A855F7" />
                        </div>
                      </Row>
                    </Column>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Row>
      </Column>
    </motion.div>
  );
};
