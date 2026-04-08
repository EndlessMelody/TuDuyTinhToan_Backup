"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import type { LobbyData, LobbySectionProps } from "./types";
import { MOCK_LOBBIES } from "./data";
import LobbyCard from "./LobbyCard";
import LobbyDetailModal from "./LobbyDetailModal";

/**
 * The top-level "Live Group Lobbies" section.
 * Manages internal state for which lobby is selected (modal).
 * Accepts optional `lobbies` prop; defaults to MOCK_LOBBIES.
 */
export default function LobbySection({ lobbies }: LobbySectionProps) {
  const data = lobbies ?? MOCK_LOBBIES;
  const [selectedLobby, setSelectedLobby] = useState<LobbyData | null>(null);

  return (
    <div
      className="font-sans antialiased"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Section Container */}
      <div className="w-full flex flex-col gap-5">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#EAF2FF] flex items-center justify-center">
              <Users size={18} className="text-[#007AFF]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">
                Live Group Lobbies
              </h2>
              <p className="text-[13px] text-[#8E8E93]">
                {data.length} active sessions near you
              </p>
            </div>
          </div>
          <Link
            href="/group-rooms"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#007AFF] bg-[#EAF2FF] px-3 py-1.5 rounded-full hover:bg-[#D6E6FF] transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards Row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {data.map((lobby, idx) => (
            <LobbyCard
              key={idx}
              lobby={lobby}
              onClick={() => setSelectedLobby(lobby)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedLobby && (
          <LobbyDetailModal
            lobby={selectedLobby}
            onClose={() => setSelectedLobby(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
