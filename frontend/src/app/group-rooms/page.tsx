"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  Search,
  MapPin,
  Clock,
  Crown,
  Zap,
  Lock,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_LOBBIES } from "@/components/features/lobby/data";
import {
  LobbyDetailModal,
  AvatarStack,
  LivePing,
} from "@/components/features/lobby";
import type {
  LobbyData,
  LobbyCategory,
  LobbyStatus,
} from "@/components/features/lobby/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = ["All", "Waiting", "In Progress", "Full"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const ALL_CATEGORIES: Array<LobbyCategory | "All"> = [
  "All",
  "Food Challenge",
  "Coffee Tour",
  "Street Food",
  "Hidden Gems",
  "Night Market",
  "Brunch",
  "Ramen Hunt",
  "Dessert Crawl",
];

const CATEGORY_EMOJI: Record<string, string> = {
  "Food Challenge": "🌶️",
  "Coffee Tour": "☕",
  "Street Food": "🍜",
  "Hidden Gems": "💎",
  "Night Market": "🌙",
  Brunch: "🥑",
  "Ramen Hunt": "🍜",
  "Dessert Crawl": "🍮",
  All: "✨",
};

const STATUS_CONFIG: Record<
  LobbyStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  waiting: {
    label: "Waiting",
    bg: "rgba(52,199,89,0.12)",
    text: "#34C759",
    dot: "#34C759",
  },
  "in-progress": {
    label: "Live",
    bg: "rgba(0,122,255,0.12)",
    text: "#007AFF",
    dot: "#007AFF",
  },
  full: {
    label: "Full",
    bg: "rgba(255,59,48,0.12)",
    text: "#FF3B30",
    dot: "#FF3B30",
  },
};

// ─── RoomCard ─────────────────────────────────────────────────────────────────

function RoomCard({
  lobby,
  onClick,
}: {
  lobby: LobbyData;
  onClick: () => void;
}) {
  const spotsLeft = lobby.spots - lobby.members.length;
  const status = lobby.status ?? "waiting";
  const statusCfg = STATUS_CONFIG[status];
  const fillPct = Math.round((lobby.members.length / lobby.spots) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      onClick={onClick}
      className="bg-white rounded-[24px] overflow-hidden cursor-pointer select-none"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 12px 40px ${lobby.accent}22`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)")
      }
    >
      {/* Cover Image */}
      <div className="relative h-[156px] overflow-hidden">
        <img
          src={lobby.bg}
          alt={lobby.name}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.4s ease" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.10) 55%, transparent 100%)",
          }}
        />

        {/* Category badge */}
        {lobby.category && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <span>{CATEGORY_EMOJI[lobby.category]}</span>
            {lobby.category}
          </div>
        )}

        {/* Status badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {status === "waiting" && <LivePing />}
          {status === "in-progress" && <Zap size={11} fill="currentColor" />}
          {status === "full" && <Lock size={11} />}
          {statusCfg.label}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="text-white font-bold text-[17px] leading-snug tracking-tight line-clamp-1">
            {lobby.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Description */}
        {lobby.description && (
          <p className="text-[13px] text-[#636366] leading-relaxed line-clamp-2 mb-3">
            {lobby.description}
          </p>
        )}

        {/* Route + Time */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#8E8E93] mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="shrink-0" /> {lobby.route}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="shrink-0" /> {lobby.time}
          </span>
        </div>

        {/* Tags */}
        {lobby.tags && lobby.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {lobby.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${lobby.accent}18`,
                  color: lobby.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Capacity bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-[12px] mb-1.5">
            <span className="text-[#8E8E93]">
              {lobby.members.length} / {lobby.spots} joined
            </span>
            {spotsLeft > 0 ? (
              <span className="font-semibold" style={{ color: lobby.accent }}>
                {spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left
              </span>
            ) : (
              <span className="text-[#FF3B30] font-semibold">Full</span>
            )}
          </div>
          <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: lobby.accent }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Host */}
          {lobby.host && (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <img
                  src={lobby.host.avatar}
                  alt={lobby.host.name}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
                <Crown
                  size={9}
                  className="absolute -top-1 -right-1 text-[#FBBF24]"
                  fill="currentColor"
                />
              </div>
              <span className="text-[12px] text-[#8E8E93] font-medium">
                {lobby.host.name}
              </span>
            </div>
          )}

          {/* Avatars + CTA */}
          <div className="flex items-center gap-2">
            <AvatarStack members={lobby.members.slice(0, 4)} spotsLeft={0} />
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-[13px] font-semibold px-3.5 py-1.5 rounded-full transition-colors"
              style={
                status === "full"
                  ? { backgroundColor: "rgba(255,59,48,0.1)", color: "#FF3B30" }
                  : status === "in-progress"
                    ? {
                        backgroundColor: "rgba(0,122,255,0.1)",
                        color: "#007AFF",
                      }
                    : {
                        backgroundColor: lobby.accent + "18",
                        color: lobby.accent,
                      }
              }
            >
              {status === "full"
                ? "Full"
                : status === "in-progress"
                  ? "Watch"
                  : "Join"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Create Room Modal ─────────────────────────────────────────────────────────

function CreateRoomModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [route, setRoute] = useState("");
  const [time, setTime] = useState("");
  const [spots, setSpots] = useState(4);
  const [category, setCategory] = useState<LobbyCategory>("Food Challenge");

  const handleCreate = () => {
    if (!name.trim() || !route.trim()) {
      toast.error("Room name and route are required.");
      return;
    }
    toast.success(`Room "${name}" created! 🎉`);
    onClose();
  };

  const inputCls =
    "w-full px-4 py-3 rounded-[14px] text-[15px] text-[#1C1C1E] bg-[#F9F9FB] border border-[#E5E5EA] outline-none focus:border-[#007AFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="bg-[#EAF2FF] px-6 pt-6 pb-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-[22px] font-bold text-[#1C1C1E] tracking-tight">
                Create a Room
              </h2>
              <p className="text-[14px] text-[#8E8E93] mt-0.5">
                Host a new group food adventure
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/60 hover:bg-white text-[#1C1C1E] rounded-full p-2 backdrop-blur-sm transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Room Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1C1C1E]">
              Room Name
            </label>
            <input
              className={inputCls}
              placeholder="e.g. Spicy Noodle Challenge"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1C1C1E]">
              Description
            </label>
            <textarea
              className={inputCls + " resize-none"}
              placeholder="Tell others what the vibe is..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1C1C1E]">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(ALL_CATEGORIES.slice(1) as LobbyCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all"
                  style={
                    category === cat
                      ? {
                          backgroundColor: "#007AFF",
                          borderColor: "#007AFF",
                          color: "#fff",
                        }
                      : {
                          backgroundColor: "#F2F2F7",
                          borderColor: "transparent",
                          color: "#3C3C43",
                        }
                  }
                >
                  <span>{CATEGORY_EMOJI[cat]}</span> {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Route */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1C1C1E]">
              Route / Location
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
              />
              <input
                className={inputCls + " pl-10"}
                placeholder="e.g. District 1 → Bến Thành"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              />
            </div>
          </div>

          {/* Time + Spots row */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1C1C1E]">
                Time
              </label>
              <div className="relative">
                <Clock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
                />
                <input
                  className={inputCls + " pl-10"}
                  placeholder="Tonight at 8 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <div className="w-28 flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1C1C1E]">
                Max Spots
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpots(Math.max(2, spots - 1))}
                  className="w-9 h-9 rounded-full bg-[#F2F2F7] text-[#1C1C1E] font-bold text-lg flex items-center justify-center hover:bg-[#E5E5EA] transition"
                >
                  −
                </button>
                <span className="text-[17px] font-bold text-[#1C1C1E] w-6 text-center">
                  {spots}
                </span>
                <button
                  onClick={() => setSpots(Math.min(12, spots + 1))}
                  className="w-9 h-9 rounded-full bg-[#F2F2F7] text-[#1C1C1E] font-bold text-lg flex items-center justify-center hover:bg-[#E5E5EA] transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[16px] text-[16px] font-semibold text-[#8E8E93] bg-[#F2F2F7] hover:bg-[#E5E5EA] transition"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="flex-[2] py-3.5 rounded-[16px] text-[16px] font-bold text-white flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
              boxShadow: "0 6px 20px rgba(0,122,255,0.32)",
            }}
          >
            <Save size={16} /> Create Room
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupRoomsPage() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("All");
  const [activeCategory, setActiveCategory] = useState<LobbyCategory | "All">(
    "All",
  );
  const [selectedLobby, setSelectedLobby] = useState<LobbyData | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const counts = useMemo(
    () => ({
      All: MOCK_LOBBIES.length,
      Waiting: MOCK_LOBBIES.filter((l) => (l.status ?? "waiting") === "waiting")
        .length,
      "In Progress": MOCK_LOBBIES.filter((l) => l.status === "in-progress")
        .length,
      Full: MOCK_LOBBIES.filter((l) => l.status === "full").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    return MOCK_LOBBIES.filter((l) => {
      const s = l.status ?? "waiting";
      const matchStatus =
        statusTab === "All" ||
        (statusTab === "Waiting" && s === "waiting") ||
        (statusTab === "In Progress" && s === "in-progress") ||
        (statusTab === "Full" && s === "full");
      const matchCat =
        activeCategory === "All" || l.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.route.toLowerCase().includes(q) ||
        (l.description ?? "").toLowerCase().includes(q);
      return matchStatus && matchCat && matchSearch;
    });
  }, [statusTab, activeCategory, search]);

  const totalMembers = MOCK_LOBBIES.reduce((s, l) => s + l.members.length, 0);
  const inProgressCount = MOCK_LOBBIES.filter(
    (l) => l.status === "in-progress",
  ).length;

  return (
    <div
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#F2F2F7",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── PAGE HEADER ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "rgba(242,242,247,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/discover">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-1.5 text-[#007AFF] text-[15px] font-semibold"
              >
                <ChevronLeft size={20} />
                Discover
              </motion.button>
            </Link>
            <div className="w-px h-5 bg-[#D1D1D6]" />
            <div>
              <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-tight leading-none">
                Group Rooms
              </h1>
              <p className="text-[13px] text-[#8E8E93] mt-0.5">
                {counts.All} active · {totalMembers} explorers online
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[14px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
              boxShadow: "0 4px 14px rgba(0,122,255,0.3)",
            }}
          >
            <Plus size={16} /> Create Room
          </motion.button>
        </div>
      </div>

      <div className="px-8 pb-12">
        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-4 mt-6 mb-6"
        >
          {[
            {
              label: "Active Rooms",
              value: counts.All,
              icon: "🏠",
              color: "#007AFF",
            },
            {
              label: "Explorers Online",
              value: totalMembers,
              icon: "👥",
              color: "#34C759",
            },
            {
              label: "In Progress Now",
              value: inProgressCount,
              icon: "⚡",
              color: "#FF9500",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-[20px] px-5 py-4 flex items-center gap-4"
              style={{
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center text-xl"
                style={{ backgroundColor: stat.color + "18" }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-[26px] font-extrabold text-[#1C1C1E] leading-none">
                  {stat.value}
                </p>
                <p className="text-[12px] text-[#8E8E93] font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-2 mb-4">
          {STATUS_TABS.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusTab(tab)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition-colors"
              style={
                statusTab === tab
                  ? {
                      backgroundColor: "#007AFF",
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(0,122,255,0.25)",
                    }
                  : {
                      backgroundColor: "#fff",
                      color: "#3C3C43",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }
              }
            >
              {tab}
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  statusTab === tab
                    ? {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                      }
                    : { backgroundColor: "#F2F2F7", color: "#8E8E93" }
                }
              >
                {counts[tab as keyof typeof counts]}
              </span>
            </motion.button>
          ))}

          {/* Search */}
          <div className="ml-auto relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="pl-9 pr-4 py-2 rounded-full text-[14px] bg-white border border-[rgba(0,0,0,0.06)] outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 transition-all w-52"
              style={{ color: "#1C1C1E" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1C1C1E]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── CATEGORY CHIPS ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
          {ALL_CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all"
              style={
                activeCategory === cat
                  ? {
                      backgroundColor: "#1C1C1E",
                      borderColor: "#1C1C1E",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "#fff",
                      borderColor: "rgba(0,0,0,0.08)",
                      color: "#3C3C43",
                    }
              }
            >
              <span>{CATEGORY_EMOJI[cat]}</span>
              {cat === "All" ? "All Categories" : cat}
            </motion.button>
          ))}
        </div>

        {/* ── ROOM GRID ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[18px] font-bold text-[#1C1C1E]">
                No rooms found
              </p>
              <p className="text-[14px] text-[#8E8E93] mt-1">
                Try a different filter or create your own!
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreate(true)}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[14px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #1A7AFF, #0057D9)",
                  boxShadow: "0 4px 14px rgba(0,122,255,0.28)",
                }}
              >
                <Plus size={15} /> Create a Room
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {filtered.map((lobby, idx) => (
                <motion.div
                  key={lobby.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.06,
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                >
                  <RoomCard
                    lobby={lobby}
                    onClick={() => setSelectedLobby(lobby)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {selectedLobby && (
          <LobbyDetailModal
            lobby={selectedLobby}
            onClose={() => setSelectedLobby(null)}
          />
        )}
        {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
