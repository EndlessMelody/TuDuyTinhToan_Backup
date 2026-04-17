"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Column, Row, Heading, Text, Button, IconButton
} from "@/components/OnceUI";
import {
    Trophy, Plus, Search, Filter, MoreVertical,
    CheckCircle2, Clock, AlertCircle, TrendingUp,
    Users, Zap, Edit3, Trash2, Eye
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
//  MOCK DATA & TYPES — Cấu trúc dữ liệu dựa trên DB Schema của ông
// ═══════════════════════════════════════════════════════════════════════
interface Challenge {
    id: number;
    title: string;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    xp_reward: number;
    status: "Active" | "Draft" | "Expired";
    participants: number;
    completion_rate: number;
}

const MOCK_CHALLENGES: Challenge[] = [
    { id: 1, title: "Thợ săn quán vỉa hè", category: "Street Food", difficulty: "Easy", xp_reward: 250, status: "Active", participants: 1204, completion_rate: 65 },
    { id: 2, title: "Vương quốc Matcha", category: "Drinks", difficulty: "Medium", xp_reward: 500, status: "Active", participants: 850, completion_rate: 42 },
    { id: 3, title: "Kẻ hủy diệt món cay", category: "Spicy", difficulty: "Hard", xp_reward: 1200, status: "Draft", participants: 0, completion_rate: 0 },
    { id: 4, title: "Check-in xuyên đêm", category: "Nightlife", difficulty: "Medium", xp_reward: 750, status: "Expired", participants: 2100, completion_rate: 88 },
];

export default function ChallengeManagementPage() {
    const [activeTab, setActiveTab] = useState<"All" | "Active" | "Draft" | "Expired">("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Logic lọc dữ liệu dựa trên Tab và Search
    const filteredChallenges = MOCK_CHALLENGES.filter(c => {
        const matchTab = activeTab === "All" || c.status === activeTab;
        const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <Column
            fillWidth
            style={{
                minHeight: "100vh",
                background: "#F2F2F7",
                overflowY: "auto",
            }}
        >
            {/* ─── HERO HEADER: Trạm điều khiển trung tâm ─── */}
            <div
                className="w-full shrink-0"
                style={{
                    background: "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)",
                    padding: "48px 48px 40px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glow Effects (Cái này làm nên độ hoành tráng) */}
                <div style={{
                    position: "absolute", top: -100, right: -50, width: 350, height: 350,
                    borderRadius: "50%", background: "rgba(0,122,255,0.15)", filter: "blur(90px)"
                }} />

                <div className="relative max-w-[1400px] mx-auto w-full flex flex-col">
                    <Row fillWidth horizontal="between" vertical="end" style={{ marginBottom: 32 }}>
                        <Column gap={8}>
                            <Row gap={12} vertical="center">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                    <Trophy size={28} className="text-[#FBBF24]" />
                                </div>
                                <Heading variant="heading-strong-l" style={{ color: "#fff" }}>
                                    Challenge Command Center
                                </Heading>
                            </Row>
                            <Text variant="body-default-m" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 500 }}>
                                Quản lý, điều phối và theo dõi hiệu suất các thử thách trên toàn hệ thống TasteMap.
                            </Text>
                        </Column>

                        <Button size="l" variant="primary" style={{ borderRadius: 16 }}>
                            <Plus size={20} style={{ marginRight: 8 }} />
                            Tạo Thử Thách Mới
                        </Button>
                    </Row>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 w-full">
                        {[
                            { label: "Active Challenges", value: "24", icon: <Zap size={16} />, color: "#34C759" },
                            { label: "Total Participants", value: "12.8k", icon: <Users size={16} />, color: "#007AFF" },
                            { label: "Avg. Completion", value: "54%", icon: <TrendingUp size={16} />, color: "#AF52DE" },
                            { label: "XP Distributed", value: "450k", icon: <Trophy size={16} />, color: "#FBBF24" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    padding: "20px",
                                    borderRadius: "24px",
                                }}
                            >
                                <Row gap={8} vertical="center" style={{ marginBottom: 12 }}>
                                    <div style={{ color: stat.color }}>{stat.icon}</div>
                                    <Text variant="body-default-xs" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {stat.label}
                                    </Text>
                                </Row>
                                <Text variant="heading-strong-m" style={{ color: "#fff" }}>{stat.value}</Text>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT: Management Area ─── */}
            <div className="max-w-[1400px] mx-auto w-full px-12 py-10 flex flex-col gap-8">

                {/* Toolbar: Search & Tabs */}
                <Row fillWidth horizontal="between" vertical="center" style={{ flexWrap: "wrap", gap: 20 }}>
                    <Row gap={4} style={{ background: "rgba(0,0,0,0.05)", padding: 4, borderRadius: 16 }}>
                        {["All", "Active", "Draft", "Expired"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className="px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all"
                                style={activeTab === tab
                                    ? { background: "#fff", color: "#1C1C1E", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
                                    : { color: "#8E8E93" }
                                }
                            >
                                {tab}
                            </button>
                        ))}
                    </Row>

                    <Row gap={12} style={{ flex: 1, maxWidth: 400 }}>
                        <div className="relative w-full">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thử thách..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <IconButton icon={<Filter size={18} />} variant="tertiary" />
                    </Row>
                </Row>

                {/* Challenge Data Table / Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {filteredChallenges.map((challenge) => (
                            <Row
                                key={challenge.id}
                                fillWidth
                                vertical="center"
                                horizontal="between"
                                style={{
                                    background: "#fff",
                                    padding: "16px 24px",
                                    borderRadius: "24px",
                                    border: "1px solid rgba(0,0,0,0.04)",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                                }}
                            >
                                <Row gap={20} vertical="center" style={{ flex: 2 }}>
                                    <div className={`p-4 rounded-2xl ${challenge.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                                            challenge.difficulty === 'Medium' ? 'bg-blue-50 text-blue-600' :
                                                'bg-red-50 text-red-600'
                                        }`}>
                                        <Zap size={20} />
                                    </div>
                                    <Column gap={4}>
                                        <Text variant="body-strong-m" style={{ color: "#1C1C1E" }}>{challenge.title}</Text>
                                        <Row gap={12} vertical="center">
                                            <Text variant="body-default-xs" style={{ color: "#8E8E93" }}>{challenge.category}</Text>
                                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D1D6" }} />
                                            <Text variant="body-default-xs" style={{
                                                fontWeight: 700, color:
                                                    challenge.difficulty === 'Easy' ? '#34C759' :
                                                        challenge.difficulty === 'Medium' ? '#007AFF' : '#FF3B30'
                                            }}>
                                                {challenge.difficulty}
                                            </Text>
                                        </Row>
                                    </Column>
                                </Row>

                                <Row gap={40} vertical="center" style={{ flex: 3, justifyContent: "center" }}>
                                    <Column align="center">
                                        <Text variant="body-default-xs" style={{ color: "#8E8E93", marginBottom: 4 }}>XP Reward</Text>
                                        <Text variant="body-strong-s" style={{ color: "#FBBF24" }}>+{challenge.xp_reward} XP</Text>
                                    </Column>
                                    <Column align="center">
                                        <Text variant="body-default-xs" style={{ color: "#8E8E93", marginBottom: 4 }}>Participants</Text>
                                        <Text variant="body-strong-s">{challenge.participants.toLocaleString()}</Text>
                                    </Column>
                                    <Column align="center" style={{ minWidth: 100 }}>
                                        <Text variant="body-default-xs" style={{ color: "#8E8E93", marginBottom: 4 }}>Completion</Text>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#007AFF]" style={{ width: `${challenge.completion_rate}%` }} />
                                        </div>
                                        <Text variant="body-default-xs" style={{ fontWeight: 700, marginTop: 4 }}>{challenge.completion_rate}%</Text>
                                    </Column>
                                </Row>

                                <Row gap={8} style={{ flex: 1, justifyContent: "flex-end" }}>
                                    <IconButton icon={<Eye size={16} />} variant="tertiary" size="s" />
                                    <IconButton icon={<Edit3 size={16} />} variant="tertiary" size="s" />
                                    <IconButton icon={<Trash2 size={16} />} variant="tertiary" size="s" style={{ color: "#FF3B30" }} />
                                </Row>
                            </Row>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Column>
    );
}