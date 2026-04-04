"use client";

import React, { useState, useEffect, useRef } from "react";
import { Column, Text } from "@/components/OnceUI";
import { motion, useScroll, AnimatePresence } from "framer-motion";

// Modular Components
import { DashboardHeader } from "@/components/features/dashboard/DashboardHeader";
import { HeroSection } from "@/components/features/dashboard/HeroSection";
import { AIPicksSection } from "@/components/features/dashboard/AIPicksSection";
import { TrendingReels } from "@/components/features/dashboard/TrendingReels";
import { ContextualNavigator } from "@/components/features/dashboard/ContextualNavigator";
import { LobbySection } from "@/components/features/lobby";
import { TasteVault } from "@/components/features/dashboard/TasteVault";
import { FoodieFeed } from "@/components/features/dashboard/FoodieFeed";
import { TasteMapProBanner } from "@/components/features/dashboard/TasteMapProBanner";

// Modals
import PostModal from "@/components/PostModal";
import ReelModal from "@/components/ReelModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { CreateRoomModal } from "@/components/modals/CreateRoomModal";

// Types & Data
import { ReelData, PostData } from "@/types/dashboard";

export default function DiscoverPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("appearance");

  // Scroll logic for header
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <React.Fragment>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: "-50%",
                background:
                  "radial-gradient(circle at 30% 30%, #007AFF15 0%, transparent 40%), radial-gradient(circle at 70% 70%, #5856D615 0%, transparent 40%), radial-gradient(circle at 50% 50%, #F2F2F7 0%, #E5E5EA 100%)",
                filter: "blur(80px)",
                zIndex: 0,
              }}
            />
            <Column horizontal="center" style={{ gap: "32px", zIndex: 10, position: "relative", width: "100vw" }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(0,122,255,0.1)", borderTopColor: "#007AFF", animation: "spin 1s cubic-bezier(0.55,0.055,0.675,0.19) infinite" }} />
              </motion.div>
              <Text align="center" style={{ color: "#1C1C1E", fontWeight: 800, fontSize: "1rem" }}>
                Preparing your TasteMap...
              </Text>
            </Column>
            <style jsx global>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      <Column
        fillHeight
        style={{ flex: 1, minWidth: 0, position: "relative", backgroundColor: "#F2F2F7" }}
      >
        <DashboardHeader
          scrollY={scrollY}
          onProfileClick={() => {}}
          onSettingsClick={() => {
            setActiveSettingsTab("appearance");
            setIsSettingsModalOpen(true);
          }}
          onNotifClick={() => {}}
        />

        <Column
          ref={scrollRef}
          className="no-scrollbar"
          fillHeight
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "0%",
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            paddingBottom: "60px",
            position: "relative",
          }}
        >
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <Column
              fillWidth
              style={{ gap: "32px", paddingTop: "32px", paddingBottom: "12px", paddingLeft: "32px", paddingRight: "32px" }}
            >
              <motion.div variants={itemVariants}><HeroSection /></motion.div>
              <motion.div variants={itemVariants}><AIPicksSection /></motion.div>
              <motion.div variants={itemVariants}>
                <TrendingReels onReelClick={(reel) => setSelectedReel(reel)} />
              </motion.div>
              <motion.div variants={itemVariants}><ContextualNavigator /></motion.div>
              <motion.div variants={itemVariants}><LobbySection /></motion.div>
              <motion.div variants={itemVariants}><TasteVault /></motion.div>
              <motion.div variants={itemVariants}>
                <FoodieFeed onPostClick={(post) => setSelectedPost(post)} />
              </motion.div>
              <motion.div variants={itemVariants}><TasteMapProBanner /></motion.div>
            </Column>
          </motion.div>
        </Column>
      </Column>

      {selectedReel && (
        <ReelModal isOpen={!!selectedReel} data={selectedReel} onClose={() => setSelectedReel(null)} />
      )}
      {selectedPost && (
        <PostModal isOpen={!!selectedPost} data={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} initialTab={activeSettingsTab} />
      <CreateRoomModal isOpen={isCreateRoomOpen} onClose={() => setIsCreateRoomOpen(false)} />
    </React.Fragment>
  );
}
