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

export default function DashboardPage() {
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
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <React.Fragment>
      {/* Loading Overlay (unchanged) */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              backgroundColor: "#F2F2F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Column horizontal="center" style={{ gap: "20px" }}>
              <motion.div
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{ 
                    rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  border: "3px solid #E5E5EA",
                  borderTopColor: "#007AFF",
                }}
              />
              <Text style={{ color: "#8E8E93", fontWeight: 600, fontSize: "0.9rem" }}>
                Preparing your TasteMap...
              </Text>
            </Column>
          </motion.div>
        )}
      </AnimatePresence>

      <Column
        fillHeight
        style={{
          flex: 1,
          minWidth: 0,
          position: "relative",
          backgroundColor: "#F2F2F7",
        }}
      >
        {/* Persistent Header - Constrained to this Column's Width */}
        <DashboardHeader 
            scrollY={scrollY}
            onProfileClick={() => {}}
            onSettingsClick={() => {
            setActiveSettingsTab("appearance");
            setIsSettingsModalOpen(true);
            }}
            onNotifClick={() => {}}
        />

        {/* Scrollable Content */}
        <Column
            ref={scrollRef}
            className="no-scrollbar"
            fillHeight
            style={{
                flex: 1,
                minWidth: 0,
                overflowY: "auto",
                paddingBottom: "60px",
                position: "relative",
            }}
        >
            <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            >
            <Column
                fillWidth
                style={{ gap: "32px", padding: "48px 64px 12px 64px" }}
            >
                {/* Main Dashboard Sections */}
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

      {/* Modals Layer */}
      {selectedReel && (
        <ReelModal
          isOpen={!!selectedReel}
          data={selectedReel}
          onClose={() => setSelectedReel(null)}
        />
      )}
      {selectedPost && (
        <PostModal
          isOpen={!!selectedPost}
          data={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={activeSettingsTab}
      />
      <CreateRoomModal 
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
      />
    </React.Fragment>
  );
}
