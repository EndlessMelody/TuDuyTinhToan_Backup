"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  IconButton,
  Input,
  Avatar,
} from "@/components/OnceUI";
import {
  Compass,
  Hand,
  MapPin,
  Users,
  Mic,
  Bell,
  MessageSquare,
  Plus,
  CloudRain,
  Flame,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Eye,
  Sun,
  Moon,
  Coffee,
  Wine,
  UtensilsCrossed,
  Sparkles,
  Navigation,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Star,
  SlidersHorizontal,
  Beer,
  User,
  Settings,
  Info,
  LogOut,
  Monitor,
  Globe,
  LifeBuoy,
  Github,
  ExternalLink,
  BellRing,
  Palette,
  ChevronDown,
} from "lucide-react";

import { LobbyCard, lobbyAvatars } from "@/components/cards/LobbyCard";
import { VaultCard } from "@/components/cards/VaultCard";
import { PostCard } from "@/components/cards/PostCard";
import { ReelCard } from "@/components/cards/ReelCard";
import { ContextCard } from "@/components/cards/ContextCard";
import { AvatarWithStatus } from "@/components/common/AvatarWithStatus";
import { ProfileMenuItem } from "@/components/common/ProfileMenuItem";
import {
  SkeletonGroupCard,
  SkeletonReelCard,
  SkeletonVaultCard,
  SkeletonFeedCard,
  SkeletonThumbnailCard,
} from "@/components/Skeletons";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import MapWidget from "@/components/Map";
import PostModal, { PostData } from "@/components/PostModal";
import ReelModal, { ReelData } from "@/components/ReelModal";
import { LobbySection } from "@/components/features/lobby";
import { StaggerContainer, StaggerItem } from "@/components/StaggerContainer";

// Mock Data Arrays
const MOCK_REELS: ReelData[] = [
  {
    title: "Crispy Pork Belly ASMR 🔥",
    user: "@foodie_ramona",
    views: "1.2M",
    userAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=700&fit=crop",
  },
  {
    title: "Hidden Ramen Spot in District 1",
    user: "@noodle_king",
    views: "890K",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=700&fit=crop",
  },
  {
    title: "Vietnamese Coffee Art ☕",
    user: "@cafe_hunter",
    views: "2.1M",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=700&fit=crop",
  },
  {
    title: "Street Bánh Mì at 3AM 🌙",
    user: "@midnight_bites",
    views: "567K",
    userAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1600454021915-de1c1cb0e91f?w=400&h=700&fit=crop",
  },
  {
    title: "Dragon Fruit Smoothie Bowl",
    user: "@healthy_vibes",
    views: "340K",
    userAvatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=700&fit=crop",
  },
  {
    title: "Seafood Hot Pot Mukbang 🦐",
    user: "@ocean_eats",
    views: "1.8M",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=700&fit=crop",
  },
];



const MOCK_POSTS: PostData[] = [
  {
    name: "Minh T.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    time: "2h",
    location: "Dĩ An",
    spotName: "Bún Bò O Trắng",
    rating: 4.8,
    review:
      "Tìm được quán bún bò chân ái mới ở Dĩ An! Nước dùng thanh, siêu nhiều thịt. Mọi người nên thử nhé. 🍜🔥",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=680&h=480&fit=crop",
    tags: ["Street Food", "Spicy"],
    likes: 42,
    comments: 8,
  },
  {
    name: "Lê Hương",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    time: "5h",
    location: "Thủ Đức",
    spotName: "Cafe Rooftop Sunset",
    rating: 4.5,
    review:
      "View đẹp, cà phê ổn, giá hơi cao nhưng đáng để trải nghiệm vào chiều cuối tuần. Chỗ ngồi ngoài trời mát lắm! ☕🌅",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=680&h=480&fit=crop",
    tags: ["Cafe", "Rooftop"],
    likes: 128,
    comments: 24,
  },
  {
    name: "Phúc Nguyễn",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&h=128&fit=crop",
    time: "8h",
    location: "Dĩ An",
    spotName: "Hủ Tiếu Nam Vang Chú Sáu",
    rating: 4.9,
    review:
      "Hủ tiếu khô ở đây xịn nhất vùng, nước lèo thơm béo, hoành thánh giòn tan. Quán đông nhưng phục vụ nhanh. Sẽ quay lại! 🤤",
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=680&h=480&fit=crop",
    tags: ["Noodles", "Budget"],
    likes: 89,
    comments: 15,
  },
  {
    name: "Thanh Vũ",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
    time: "12h",
    location: "Bình Dương",
    spotName: "BBQ Garden Night",
    rating: 4.3,
    review:
      "Thịt nướng ướp khói thơm phức, bia đá lạnh. Không gian ngoài trời thoáng mát, nhạc acoustic live nữa. 🍖🍻",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=680&h=480&fit=crop",
    tags: ["BBQ", "Night Life"],
    likes: 67,
    comments: 11,
  },
];



function getDynamicContext() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return {
      title: "Morning Energy Boost",
      icon: <Sun size={20} color="#FBBF24" />,
      accent: "#FBBF24",
      tags: ["Breakfast", "Coffee", "Juice Bar", "Bakery"],
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      title: "Lunch Power-Up",
      icon: <UtensilsCrossed size={20} color="#F97316" />,
      accent: "#F97316",
      tags: ["Rice", "Noodles", "Quick Bites", "Healthy"],
    };
  } else if (hour >= 15 && hour < 19) {
    return {
      title: "Afternoon Chill & Snacks",
      icon: <Coffee size={20} color="#A78BFA" />,
      accent: "#A78BFA",
      tags: ["Cafe", "Dessert", "Boba", "Chill Spots"],
    };
  } else if (hour >= 19 && hour < 22) {
    return {
      title: "Dinner & Unwind",
      icon: <Wine size={20} color="#F472B6" />,
      accent: "#F472B6",
      tags: ["BBQ", "Hotpot", "Fine Dining", "Rooftop"],
    };
  } else {
    return {
      title: "Dĩ An Late Night Cravings",
      icon: <Moon size={20} color="#60A5FA" />,
      accent: "#60A5FA",
      tags: ["Street Food", "24h Spots", "Ramen", "Midnight Snacks"],
    };
  }
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isRightExpanded, setIsRightExpanded] = useState(false);

  // Modal States
  const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const handleComingSoon = () =>
    toast("Will be updated in the next version 🚀");
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  const headerWidth = useTransform(scrollY, [0, 80], ["100%", "80%"]);
  const headerRadius = useTransform(scrollY, [0, 80], ["0px", "32px"]);
  const headerTop = useTransform(scrollY, [0, 80], ["0px", "12px"]);
  const headerPadding = useTransform(scrollY, [0, 80], ["14px 40px", "10px 24px"]);
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["none", "0 10px 30px -5px rgba(0, 0, 0, 0.08)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0.05)", "rgba(0,0,0,0.08)"]
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("appearance");
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Click-outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const groupToursRef = useRef<HTMLDivElement>(null);
  const eatItAgainRef = useRef<HTMLDivElement>(null);

  const scrollList = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sidebarWidth = isSidebarOpen ? 280 : 80;

  return (
    <React.Fragment>
      {/* ═══════════ 2. CENTER PANEL ═══════════ */}
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
        {/* Sticky Glassmorphism Header (Dynamic Island) */}
        <motion.div
          className="sticky z-50 bg-white/80 backdrop-blur-xl"
          style={{
            width: headerWidth,
            borderRadius: headerRadius,
            top: headerTop,
            padding: headerPadding,
            boxShadow: headerShadow,
            border: `1px solid ${headerBorder}`,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            left: 0,
            right: 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          animate={{
            scale: isSearchFocused ? 1.005 : 1,
            width: isSearchFocused ? "85%" : undefined,
          }}
        >
          <Row style={{ gap: "16px", alignItems: "center" }}>
            {/* Location Pill */}
            <Row
              style={{
                backgroundColor: "#F2F2F7",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #E5E5EA",
                cursor: "pointer",
                gap: "8px",
                alignItems: "center",
                transition: "all 0.2s",
              }}
            >
              <MapPin size={16} color="#ED1B24" />
              <Text
                style={{ color: "#1C1C1E", fontWeight: 600, fontSize: "0.82rem" }}
              >
                Dĩ An, Bình Dương
              </Text>
              <span
                style={{
                  color: "#C7C7CC",
                  fontSize: "0.7rem",
                  marginLeft: "2px",
                }}
              >
                ▼
              </span>
            </Row>
            {/* Command Palette Search */}
            <Row style={{ width: "420px", position: "relative" }}>
              <Input
                placeholder="Search locations, tours, foodies..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  borderRadius: "999px",
                  padding: "10px 20px",
                  width: "100%",
                  border: isSearchFocused ? "1.5px solid #007AFF" : "1px solid #E5E5EA",
                  transition: "all 0.2s",
                }}
              />
              <Row
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  gap: "3px",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#F2F2F7",
                    border: "1px solid #E5E5EA",
                    borderRadius: "4px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "#AEAEB2",
                    lineHeight: 1.2,
                  }}
                >
                  Ctrl + K
                </span>
              </Row>
            </Row>
          </Row>
          <Row style={{ gap: "8px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <IconButton
                icon={
                  <Bell
                    size={20}
                    color={isNotifOpen ? "#FBBF24" : "#8E8E93"}
                  />
                }
                variant="tertiary"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{ borderRadius: "10px", transition: "all 0.2s" }}
              />
              {/* Notification dot */}
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#ED1B24",
                  border: "2px solid #FFFFFF",
                }}
              />

              {/* Notification Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      zIndex: 100,
                      width: "420px",
                      backgroundColor: "rgba(255,255,255,0.97)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
                    }}
                  >
                    {/* Header */}
                    <Column
                      borderBottom="neutral-alpha-weak"
                      style={{
                        padding: "20px 20px 16px",
                      }}
                    >
                      <Heading
                        variant="heading-strong-s"
                        style={{ color: "#1C1C1E" }}
                      >
                        Notifications
                      </Heading>
                    </Column>

                    {/* Social */}
                    <Column style={{ padding: "16px 16px", gap: "4px" }}>
                      <Text
                        style={{
                          color: "#C7C7CC",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          padding: "0 8px",
                          marginBottom: "4px",
                        }}
                      >
                        Social
                      </Text>
                      <Row
                        radius="m"
                        style={{
                          gap: "12px",
                          alignItems: "center",
                          padding: "12px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "#F2F2F7")
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <Avatar
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop"
                          size="s"
                        />
                        <Column style={{ gap: "2px", flex: 1 }}>
                          <Text style={{ color: "#1C1C1E", fontSize: "0.8rem", lineHeight: 1.5 }}>
                            <strong>Ramona</strong> checked in at Phở 36
                          </Text>
                          <Text
                            style={{
                              color: "#AEAEB2",
                              fontSize: "0.7rem",
                            }}
                          >
                            2 min ago
                          </Text>
                        </Column>
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "var(--brand-solid-strong, #007AFF)",
                            flexShrink: 0,
                          }}
                        />
                      </Row>
                      <Row
                        radius="m"
                        style={{
                          gap: "12px",
                          alignItems: "center",
                          padding: "12px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "#F2F2F7")
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <Avatar
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                          size="s"
                        />
                        <Column style={{ gap: "2px", flex: 1 }}>
                          <Text style={{ color: "#1C1C1E", fontSize: "0.8rem", lineHeight: 1.5 }}>
                            <strong>Khoa</strong> invited you to Coffee Lovers
                            lobby
                          </Text>
                          <Text
                            style={{
                              color: "#AEAEB2",
                              fontSize: "0.7rem",
                            }}
                          >
                            15 min ago
                          </Text>
                        </Column>
                      </Row>
                    </Column>

                    {/* Deals */}
                    <Column
                      borderTop="neutral-alpha-weak"
                      style={{
                        padding: "16px 16px",
                        gap: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#C7C7CC",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          padding: "0 8px",
                          marginBottom: "4px",
                        }}
                      >
                        Deals
                      </Text>
                      <Row
                        radius="m"
                        style={{
                          gap: "12px",
                          alignItems: "center",
                          padding: "12px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "#F2F2F7")
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(251,191,36,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Sparkles size={16} color="#FBBF24" />
                        </div>
                        <Column style={{ gap: "2px", flex: 1 }}>
                          <Text style={{ color: "#1C1C1E", fontSize: "0.8rem", lineHeight: 1.5 }}>
                            30% off at Matcha Garden today!
                          </Text>
                          <Text
                            style={{
                              color: "#AEAEB2",
                              fontSize: "0.7rem",
                            }}
                          >
                            Expires in 3h
                          </Text>
                        </Column>
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "var(--brand-solid-strong, #007AFF)",
                            flexShrink: 0,
                          }}
                        />
                      </Row>
                    </Column>

                    {/* System */}
                    <Column
                      borderTop="neutral-alpha-weak"
                      style={{
                        padding: "16px 16px 20px",
                        gap: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#C7C7CC",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          padding: "0 8px",
                          marginBottom: "4px",
                        }}
                      >
                        System
                      </Text>
                      <Row
                        radius="m"
                        style={{
                          gap: "12px",
                          alignItems: "center",
                          padding: "12px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "#F2F2F7")
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(168,85,247,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Compass size={16} color="#A855F7" />
                        </div>
                        <Column style={{ gap: "2px", flex: 1 }}>
                          <Text style={{ color: "#1C1C1E", fontSize: "0.8rem", lineHeight: 1.5 }}>
                            Your Taste Vector updated
                          </Text>
                          <Text
                            style={{
                              color: "#AEAEB2",
                              fontSize: "0.7rem",
                            }}
                          >
                            +3 Spicy, +2 Street Food
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <IconButton
              icon={<MessageSquare size={20} color="#8E8E93" />}
              variant="tertiary"
              onClick={handleComingSoon}
              style={{ borderRadius: "10px" }}
            />
            <div ref={profileMenuRef} style={{ position: "relative" }}>
              <Row
                style={{
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "12px",
                  cursor: "pointer",
                }}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <Avatar
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop"
                  size="m"
                />
                <Column>
                  <Text
                    style={{
                      color: "#1C1C1E",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Ramona F.
                  </Text>
                  <Text
                    style={{
                      color: "#AEAEB2",
                      fontSize: "0.7rem",
                    }}
                  >
                    Level 12
                  </Text>
                </Column>
              </Row>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    style={{
                      position: "absolute",
                      top: "56px",
                      right: 0,
                      zIndex: 999,
                      width: "280px",
                      backgroundColor: "rgba(255,255,255,0.97)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid #E5E5EA",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
                      padding: "6px",
                    }}
                  >
                    {/* User Summary */}
                    <Column style={{ padding: "18px 18px 16px", gap: "0" }}>
                      <Row style={{ gap: "16px", alignItems: "center" }}>
                        <Avatar
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop"
                          size="l"
                        />
                        <Column style={{ gap: "4px" }}>
                          <Text
                            style={{
                              color: "#1C1C1E",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                            }}
                          >
                            Ramona F.
                          </Text>
                          <Text
                            style={{
                              color: "#AEAEB2",
                              fontSize: "0.72rem",
                            }}
                          >
                            Level 12 • Taste Explorer
                          </Text>
                        </Column>
                      </Row>
                    </Column>

                    {/* Divider */}
                    <div style={{ padding: "0 10px" }}>
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#F2F2F7",
                        }}
                      />
                    </div>

                    {/* Action Items */}
                    <Column style={{ padding: "8px 0" }}>
                      <ProfileMenuItem
                        icon={<User size={16} />}
                        label="Hồ sơ cá nhân"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push("/profile");
                        }}
                      />
                      <ProfileMenuItem
                        icon={<Settings size={16} />}
                        label="Tùy chỉnh hệ thống"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setActiveSettingsTab("appearance");
                          setIsSettingsModalOpen(true);
                        }}
                      />
                      <ProfileMenuItem
                        icon={<Info size={16} />}
                        label="Thông tin & Trợ giúp"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setActiveSettingsTab("support");
                          setIsSettingsModalOpen(true);
                        }}
                      />
                    </Column>

                    {/* Divider */}
                    <div style={{ padding: "0 10px" }}>
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#F2F2F7",
                        }}
                      />
                    </div>

                    {/* Logout */}
                    <Column style={{ padding: "8px 0" }}>
                      <Row
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          toast("Đã đăng xuất! 👋");
                        }}
                        style={{
                          padding: "12px 18px",
                          gap: "16px",
                          alignItems: "center",
                          cursor: "pointer",
                          borderRadius: "8px",
                          margin: "0 4px",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(237,27,36,0.08)")
                        }
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <LogOut size={16} color="#ED1B24" />
                        <Text
                          style={{
                            color: "#ED1B24",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          Đăng xuất
                        </Text>
                      </Row>
                    </Column>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Row>
        </motion.div>

        {/* Main Content */}
        <Column
          fillWidth
          style={{ gap: "24px", padding: "48px 64px 12px 64px" }}
        >
          {/* ═══ 1. HERO BENTO: Map + Banner ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Row fillWidth style={{ gap: "20px", height: "320px" }}>
              {/* Map Box */}
              <Column
                className="bg-slate-100 rounded-[24px] overflow-hidden border border-[#E5E5EA]"
                style={{
                  width: "320px",
                  minWidth: "320px",
                  height: "320px",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <MapWidget />
              </Column>

              {/* Hero Banner */}
              <Column
                className="bg-white border border-[#E5E5EA] rounded-[24px] overflow-hidden"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: "320px",
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=600&fit=crop)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                {/* White Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 40%, transparent 100%)",
                  }}
                />

                <Column
                  style={{
                    position: "relative",
                    zIndex: 10,
                    justifyContent: "center",
                    padding: "36px 40px",
                    height: "100%",
                    gap: "16px",
                  }}
                >
                  {/* Tags */}
                  <Row
                    style={{
                      gap: "8px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "5px 12px",
                        backgroundColor: "rgba(245,158,11,0.1)",
                        borderRadius: "8px",
                        color: "#D97706",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      Ad • Sponsored
                    </span>
                    <span
                      style={{
                        padding: "5px 12px",
                        backgroundColor: "rgba(0,122,255,0.1)",
                        borderRadius: "8px",
                        color: "#007AFF",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      100XP / spot
                    </span>
                    <Row
                      style={{
                        padding: "5px 12px",
                        backgroundColor: "#E5E5EA",
                        borderRadius: "8px",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <CloudRain size={12} color="#8E8E93" />
                      <Text
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#636366",
                        }}
                      >
                        Light Rain • 1.2km
                      </Text>
                    </Row>
                  </Row>

                  {/* Title */}
                  <Heading
                    variant="display-strong-m"
                    style={{ color: "#1C1C1E", lineHeight: 1.1 }}
                  >
                    Weekend Street
                    <br />
                    Food Tour
                  </Heading>

                  {/* Avatars */}
                  <Row style={{ gap: "0px", alignItems: "center" }}>
                    <Avatar
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop"
                      size="s"
                      style={{ border: "2px solid #FFFFFF" }}
                    />
                    <Avatar
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop"
                      size="s"
                      style={{
                        marginLeft: "-10px",
                        border: "2px solid #FFFFFF",
                      }}
                    />
                    <Avatar
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop"
                      size="s"
                      style={{
                        marginLeft: "-10px",
                        border: "2px solid #FFFFFF",
                      }}
                    />
                    <Text
                      style={{
                        color: "#8E8E93",
                        fontSize: "0.8rem",
                        marginLeft: "10px",
                        fontWeight: 500,
                      }}
                    >
                      +5 friends tracking
                    </Text>
                  </Row>

                  {/* CTA */}
                  <Row
                    style={{
                      gap: "12px",
                      alignItems: "center",
                      marginTop: "4px",
                    }}
                  >
                    <Button
                      size="l"
                      variant="primary"
                      onClick={() => router.push("/tour-builder")}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <span style={{ position: "relative", zIndex: 1 }}>
                        Book Now
                      </span>
                      <motion.div
                        initial={{ x: "-200%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "linear",
                          repeatDelay: 2,
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: "40%",
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                          transform: "skewX(-20deg)",
                          zIndex: 0,
                        }}
                      />
                    </Button>
                    <IconButton
                      icon={<Navigation size={20} color="#007AFF" />}
                      onClick={handleComingSoon}
                      style={{
                        backgroundColor: "#EAF2FF",
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                      }}
                    />
                  </Row>
                </Column>
              </Column>
            </Row>
          </motion.div>

          {/* ═══ AI PICKS FOR YOU ═══ */}
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
                <Text
                  onClick={handleComingSoon}
                  style={{
                    color: "#A855F7",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Refresh
                </Text>
              </Row>
              <Row
                className="no-scrollbar"
                fillWidth
                style={{ gap: "16px", overflowX: "auto", paddingBottom: "4px" }}
              >
                {[
                  {
                    title: "Bún Bò Huế Cô Giào",
                    reason: "Because you love Spicy + Street Food",
                    match: 97,
                    price: "35k",
                    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop",
                    color: "#E63946",
                  },
                  {
                    title: "The Alley Boba",
                    reason: "Popular with your friends",
                    match: 92,
                    price: "55k",
                    img: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=300&h=200&fit=crop",
                    color: "#2A9D8F",
                  },
                  {
                    title: "Ramen Shin Tokyo",
                    reason: "Trending in your area",
                    match: 89,
                    price: "95k",
                    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
                    color: "#FF6B35",
                  },
                  {
                    title: "Rooftop BBQ Night",
                    reason: "Matches your Night Owl profile",
                    match: 85,
                    price: "180k",
                    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop",
                    color: "#7B2FF7",
                  },
                ].map((pick, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => router.push("/tour-builder")}
                    style={{
                      minWidth: "260px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E5EA",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="overflow-hidden relative"
                      style={{
                        height: "120px",
                      }}
                    >
                      <img
                        src={pick.img}
                        alt={pick.title}
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
                          background: `linear-gradient(to bottom, transparent 40%, ${pick.color}30 100%)`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          padding: "4px 10px",
                          backgroundColor: "rgba(255,255,255,0.85)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.5)",
                        }}
                      >
                        <Text
                          style={{
                            color: "#FBBF24",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          {pick.match}%
                        </Text>
                      </div>
                    </div>
                    <Column style={{ padding: "14px 16px", gap: "6px" }}>
                      <Text
                        style={{
                          color: "#1C1C1E",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {pick.title}
                      </Text>
                      <Row style={{ gap: "6px", alignItems: "center" }}>
                        <Sparkles size={10} color={pick.color} />
                        <Text
                          style={{
                            color: pick.color,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        >
                          {pick.reason}
                        </Text>
                      </Row>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.75rem",
                        }}
                      >
                        ~{pick.price} VND
                      </Text>
                    </Column>
                  </motion.div>
                ))}
              </Row>
            </Column>
          </motion.div>

          {/* ═══ 2. TRENDING REELS ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
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
                  <Flame size={20} color="#ED1B24" />
                  <Heading
                    variant="heading-strong-l"
                    weight="strong"
                    style={{ color: "#1C1C1E" }}
                  >
                    Trending Reels
                  </Heading>
                </Row>
                <Text
                  onClick={handleComingSoon}
                  style={{
                    color: "#007AFF",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                >
                  View all
                </Text>
              </Row>
              <Row
                className="no-scrollbar"
                fillWidth
                style={{
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollBehavior: "smooth",
                }}
              >
                <StaggerContainer
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    paddingBottom: "4px",
                  }}
                >
                  {MOCK_REELS.map((reel, idx) => (
                    <StaggerItem key={idx}>
                      <div
                        onClick={() => setSelectedReel(reel)}
                        style={{ cursor: "pointer" }}
                      >
                        <ReelCard
                          title={reel.title}
                          user={reel.user}
                          views={reel.views}
                          avatar={reel.userAvatar}
                          img={reel.img}
                          delay={0}
                        />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Row>
            </Column>
          </motion.div>

          {/* ═══ 3. DYNAMIC CONTEXTUAL SUGGESTIONS ═══ */}
          {(() => {
            const ctx = getDynamicContext();
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
                              padding: "3px 10px",
                              backgroundColor: `${ctx.accent}15`,
                              border: `1px solid ${ctx.accent}30`,
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
                      onClick={handleComingSoon}
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
                      scrollBehavior: "smooth",
                    }}
                  >
                    <ContextCard
                      title="Phở Bò 36 Lý Quốc Sư"
                      subtitle="Open until 2AM • 0.8km away"
                      match={94}
                      accent={ctx.accent}
                      img="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=250&fit=crop"
                      delay={0}
                    />
                    <ContextCard
                      title="Bánh Tráng Trộn Cô Ba"
                      subtitle="Trending tonight • 1.2km away"
                      match={87}
                      accent={ctx.accent}
                      img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop"
                      delay={0.05}
                    />
                    <ContextCard
                      title="Cơm Tấm Sườn Bì Chả"
                      subtitle="Crowded now • 0.5km away"
                      match={91}
                      accent={ctx.accent}
                      img="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop"
                      delay={0.1}
                    />
                    <ContextCard
                      title="Kem Bơ Thanh Long"
                      subtitle="Just opened • 2.1km away"
                      match={78}
                      accent={ctx.accent}
                      img="https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=250&fit=crop"
                      delay={0.15}
                    />
                    <ContextCard
                      title="Bún Riêu Cua Đồng"
                      subtitle="Top rated • 1.5km away"
                      match={85}
                      accent={ctx.accent}
                      img="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop"
                      delay={0.2}
                    />
                  </Row>
                </Column>
              </motion.div>
            );
          })()}

          {/* ══ Live Group Lobbies (iOS Style) ══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <LobbySection />
          </motion.div>

          {/* ══ The Taste Vault ══ */}
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
                    icon={
                      <ChevronLeft size={18} color="#636366" />
                    }
                    onClick={() => scrollList(eatItAgainRef, "left")}
                    style={{
                      backgroundColor: "#F2F2F7",
                      borderRadius: "10px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                    }}
                  />
                  <IconButton
                    icon={
                      <ChevronRight size={18} color="#636366" />
                    }
                    onClick={() => scrollList(eatItAgainRef, "right")}
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
                ref={eatItAgainRef}
                className="no-scrollbar"
                fillWidth
                style={{
                  overflowX: "auto",
                  gap: "16px",
                  paddingBottom: "8px",
                  scrollBehavior: "smooth",
                }}
              >
                <VaultCard
                  title="Banh Mi Pho 古"
                  xp="10XP"
                  img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=520&h=360&fit=crop"
                  tags="Vietnamese • Street Food"
                  rating={4.8}
                  delay={0.05}
                />
                <VaultCard
                  title="Neon Diner"
                  xp="15XP"
                  img="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=520&h=360&fit=crop"
                  tags="American • Retro"
                  rating={4.2}
                  delay={0.1}
                />
                <VaultCard
                  title="Matcha Room"
                  xp="30XP"
                  img="https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=520&h=360&fit=crop"
                  tags="Japanese • Cafe"
                  rating={4.6}
                  delay={0.15}
                />
                <VaultCard
                  title="Sky Bar"
                  xp="10XP"
                  img="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=520&h=360&fit=crop"
                  tags="Cocktails • View"
                  rating={4.4}
                  delay={0.2}
                />
                <VaultCard
                  title="Phở Sáng"
                  xp="20XP"
                  img="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=520&h=360&fit=crop"
                  tags="Vietnamese • Breakfast"
                  rating={4.9}
                  delay={0.25}
                />
              </Row>
            </Column>
          </motion.div>

          {/* ═══════════ FOODIE FEED (Horizontal Carousel) ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Column fillWidth style={{ gap: "20px" }}>
              {/* Feed Header */}
              <Row
                fillWidth
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Row style={{ alignItems: "center", gap: "10px" }}>
                  <MessageCircle size={20} color="#ED1B24" />
                  <Heading
                    variant="heading-strong-l"
                    weight="strong"
                    style={{ color: "#1C1C1E" }}
                  >
                    Foodie Feed
                  </Heading>
                </Row>
                <Row style={{ gap: "8px", alignItems: "center" }}>
                  <IconButton
                    icon={
                      <SlidersHorizontal
                        size={18}
                        color="#8E8E93"
                      />
                    }
                    style={{
                      backgroundColor: "#F2F2F7",
                      borderRadius: "10px",
                      width: "32px",
                      height: "32px",
                    }}
                  />
                  <Button
                    size="s"
                    variant="secondary"
                    style={{ borderRadius: "10px" }}
                  >
                    Local: Dĩ An
                  </Button>
                </Row>
              </Row>

              {/* Horizontal Feed Cards */}
              <Row
                className="no-scrollbar"
                fillWidth
                style={{
                  overflowX: "auto",
                  gap: "16px",
                  paddingBottom: "8px",
                  scrollBehavior: "smooth",
                }}
              >
                <StaggerContainer
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    paddingBottom: "8px",
                  }}
                >
                  {MOCK_POSTS.map((post, idx) => (
                    <StaggerItem key={idx}>
                      <div onClick={() => setSelectedPost(post)}>
                        <PostCard {...post} delay={0} />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Row>
            </Column>
          </motion.div>
          
          {/* ═══ MOCK PROMO AD: TasteMap Pro ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Column
              className="rounded-[32px] overflow-hidden border border-[#E5E5EA] relative"
              style={{
                width: "100%",
                height: "280px",
                backgroundImage: "url(/premium_dining_promo_background_1774965665845.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onClick={() => toast("TasteMap Pro: Coming late 2026! 💎")}
            >
              {/* Glassmorphic Overlay */}
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                  zIndex: 1
                }}
              />
              
              <Column
                style={{
                  position: "relative",
                  zIndex: 10,
                  height: "100%",
                  justifyContent: "center",
                  padding: "0 60px",
                  gap: "16px",
                  maxWidth: "600px"
                }}
              >
                <Row style={{ gap: "8px", alignItems: "center" }}>
                  <div style={{ padding: "4px 10px", backgroundColor: "#FBBF24", borderRadius: "6px" }}>
                    <Text style={{ color: "#000", fontWeight: 800, fontSize: "0.65rem", textTransform: "uppercase" }}>
                      PRO FEATURE
                    </Text>
                  </div>
                  <Text style={{ color: "white", fontSize: "0.8rem", fontWeight: 600, opacity: 0.8 }}>
                    Exclusive for Elite Explorers
                  </Text>
                </Row>
                
                <Heading variant="display-strong-s" style={{ color: "white", fontSize: "2.2rem" }}>
                  Elevate Your Journey:
                  <br />
                  Become a TasteMap Pro.
                </Heading>
                
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Join Ramona F. and 50k+ elite foodies in shaping the future of global dining. Get priority AI matching and seasonal rewards.
                </Text>
                
                <Row style={{ marginTop: "8px" }}>
                  <Button 
                    size="l" 
                    variant="primary"
                    style={{ 
                      backgroundColor: "white", 
                      color: "black", 
                      borderRadius: "12px",
                      padding: "12px 32px"
                    }}
                  >
                    Join the Elite
                  </Button>
                </Row>
              </Column>
              
              {/* Decorative Glow */}
              <div 
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  right: "-50px",
                  width: "200px",
                  height: "200px",
                  backgroundColor: "rgba(251,191,36,0.15)",
                  filter: "blur(60px)",
                  borderRadius: "50%",
                  zIndex: 0
                }}
              />
            </Column>
          </motion.div>
        </Column>
      </Column>

      {/* ═══════════ MODALS ═══════════ */}
      {selectedReel && (
        <ReelModal
          isOpen={!!selectedReel}
          data={selectedReel as any}
          onClose={() => setSelectedReel(null)}
        />
      )}
      {/* Lobby modal is now handled inside IOSLobbiesSection */}
      {selectedPost && (
        <PostModal
          isOpen={!!selectedPost}
          data={selectedPost as any}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* ═══════════ MODAL ═══════════ */}
      <AnimatePresence>
        {isCreateRoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "#FFFFFF",
                borderRadius: "32px",
                border: "1px solid #E5E5EA",
                boxShadow: "0 32px 80px rgba(0,0,0,0.1)",
                padding: "32px",
              }}
            >
              <Row
                fillWidth
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <Heading variant="heading-strong-l" style={{ color: "#1C1C1E" }}>
                  Start Group Room
                </Heading>
                <IconButton
                  icon={<X size={18} color="#636366" />}
                  onClick={() => setIsCreateRoomOpen(false)}
                  variant="tertiary"
                  style={{ cursor: "pointer" }}
                />
              </Row>
              <Column style={{ gap: "24px" }}>
                <Column style={{ gap: "8px" }}>
                  <Text
                    style={{
                      color: "#8E8E93",
                      fontSize: "0.8rem",
                    }}
                  >
                    Room Name
                  </Text>
                  <Input
                    placeholder="e.g. Saturday Midnight Snacks"
                    style={{ borderRadius: "12px", padding: "14px 16px" }}
                  />
                </Column>
                <Column style={{ gap: "8px" }}>
                  <Text
                    style={{
                      color: "#8E8E93",
                      fontSize: "0.8rem",
                    }}
                  >
                    Invite Foodies
                  </Text>
                  <Row style={{ gap: "16px", flexWrap: "wrap" }}>
                    <Column
                      style={{
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop"
                        size="m"
                      />
                      <Text style={{ color: "#1C1C1E", fontSize: "0.7rem" }}>
                        Ramona
                      </Text>
                    </Column>
                    <Column
                      style={{
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
                        size="m"
                      />
                      <Text style={{ color: "#1C1C1E", fontSize: "0.7rem" }}>
                        Jane
                      </Text>
                    </Column>
                    <Column
                      style={{
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        opacity: 0.4,
                      }}
                    >
                      <Avatar
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop"
                        size="m"
                      />
                      <Text style={{ color: "#1C1C1E", fontSize: "0.7rem" }}>
                        Mike
                      </Text>
                    </Column>
                  </Row>
                </Column>
                <Button
                  size="l"
                  onClick={() => setIsCreateRoomOpen(false)}
                  style={{ marginTop: "8px", borderRadius: "12px" }}
                >
                  Initialize Minimax Engine
                </Button>
              </Column>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ SETTINGS & INFO MODAL ═══════ */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSettingsModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{
                width: "900px",
                maxWidth: "95vw",
                height: "600px",
                maxHeight: "90vh",
                backgroundColor: "#F2F2F7",
                border: "1px solid #E5E5EA",
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {/* Left Sidebar Tabs */}
              <Column
                style={{
                  width: "240px",
                  minWidth: "240px",
                  backgroundColor: "#FFFFFF",
                  borderRight: "1px solid #E5E5EA",
                  padding: "20px 12px",
                  gap: "4px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Row
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 8px 16px",
                    borderBottom: "1px solid #E5E5EA",
                    marginBottom: "8px",
                  }}
                >
                  <Heading
                    variant="heading-strong-s"
                    style={{ color: "#1C1C1E" }}
                  >
                    Cài đặt
                  </Heading>
                  <IconButton
                    icon={<X size={16} color="#AEAEB2" />}
                    onClick={() => setIsSettingsModalOpen(false)}
                    style={{
                      backgroundColor: "#F2F2F7",
                      borderRadius: "8px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                    }}
                  />
                </Row>

                {[
                  {
                    id: "appearance",
                    label: "Giao diện",
                    icon: <Palette size={16} />,
                  },
                  {
                    id: "language",
                    label: "Ngôn ngữ",
                    icon: <Globe size={16} />,
                  },
                  {
                    id: "notifications",
                    label: "Thông báo",
                    icon: <BellRing size={16} />,
                  },
                ].map((tab) => (
                  <Row
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    style={{
                      padding: "10px 12px",
                      gap: "12px",
                      alignItems: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor:
                        activeSettingsTab === tab.id
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                      color:
                        activeSettingsTab === tab.id
                          ? "white"
                          : "rgba(255,255,255,0.45)",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", color: "inherit" }}>
                      {tab.icon}
                    </div>
                    <Text
                      style={{
                        color: "inherit",
                        fontWeight: activeSettingsTab === tab.id ? 600 : 400,
                        fontSize: "0.85rem",
                      }}
                    >
                      {tab.label}
                    </Text>
                  </Row>
                ))}

                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#F2F2F7",
                    margin: "8px 0",
                  }}
                />

                {[
                  {
                    id: "support",
                    label: "Trợ giúp",
                    icon: <LifeBuoy size={16} />,
                  },
                  { id: "about", label: "Thông tin", icon: <Info size={16} /> },
                ].map((tab) => (
                  <Row
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    style={{
                      padding: "10px 12px",
                      gap: "12px",
                      alignItems: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor:
                        activeSettingsTab === tab.id
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                      color:
                        activeSettingsTab === tab.id
                          ? "white"
                          : "rgba(255,255,255,0.45)",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", color: "inherit" }}>
                      {tab.icon}
                    </div>
                    <Text
                      style={{
                        color: "inherit",
                        fontWeight: activeSettingsTab === tab.id ? 600 : 400,
                        fontSize: "0.85rem",
                      }}
                    >
                      {tab.label}
                    </Text>
                  </Row>
                ))}

                {/* Bottom branding */}
                <div style={{ flex: 1 }} />
                <Text
                  style={{
                    color: "#D1D1D6",
                    fontSize: "0.65rem",
                    padding: "0 8px",
                  }}
                >
                  TasteMap v1.0.0-beta
                </Text>
              </Column>

              {/* Right Content Area */}
              <Column
                style={{
                  flex: 1,
                  padding: "32px 40px",
                  overflowY: "auto",
                  gap: "24px",
                }}
              >
                {/* ─── APPEARANCE TAB ─── */}
                {activeSettingsTab === "appearance" && (
                  <>
                    <Column style={{ gap: "4px" }}>
                      <Heading
                        variant="heading-strong-m"
                        style={{ color: "#1C1C1E" }}
                      >
                        Giao diện (Appearance)
                      </Heading>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.8rem",
                        }}
                      >
                        Chọn theme hiển thị cho ứng dụng
                      </Text>
                    </Column>
                    <Row style={{ gap: "16px" }}>
                      {[
                        {
                          id: "light",
                          label: "Sáng",
                          icon: <Sun size={24} />,
                          active: false,
                        },
                        {
                          id: "dark",
                          label: "Tối",
                          icon: <Moon size={24} />,
                          active: true,
                        },
                        {
                          id: "system",
                          label: "Hệ thống",
                          icon: <Monitor size={24} />,
                          active: false,
                        },
                      ].map((theme) => (
                        <Column
                          key={theme.id}
                          onClick={handleComingSoon}
                          style={{
                            flex: 1,
                            padding: "24px 16px",
                            alignItems: "center",
                            gap: "12px",
                            backgroundColor: theme.active
                              ? "rgba(0,209,178,0.08)"
                              : "rgba(255,255,255,0.03)",
                            border: theme.active
                              ? "2px solid #00D1B2"
                              : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "14px",
                            cursor: "pointer",
                            boxShadow: theme.active
                              ? "0 0 20px rgba(0,209,178,0.15)"
                              : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              color: theme.active
                                ? "#00D1B2"
                                : "rgba(255,255,255,0.4)",
                            }}
                          >
                            {theme.icon}
                          </div>
                          <Text
                            style={{
                              color: theme.active
                                ? "#00D1B2"
                                : "rgba(255,255,255,0.5)",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                            }}
                          >
                            {theme.label}
                          </Text>
                        </Column>
                      ))}
                    </Row>

                    {/* Accent Color */}
                    <Column style={{ gap: "12px", marginTop: "8px" }}>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Màu nhấn
                      </Text>
                      <Row style={{ gap: "10px" }}>
                        {[
                          "#ED1B24",
                          "#00D1B2",
                          "#A855F7",
                          "#FBBF24",
                          "#3B82F6",
                          "#F97316",
                        ].map((c) => (
                          <div
                            key={c}
                            onClick={handleComingSoon}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              backgroundColor: c,
                              border:
                                c === "#ED1B24"
                                  ? "3px solid white"
                                  : "2px solid transparent",
                              cursor: "pointer",
                              transition: "transform 0.15s",
                              boxShadow:
                                c === "#ED1B24" ? `0 0 12px ${c}60` : "none",
                            }}
                          />
                        ))}
                      </Row>
                    </Column>
                  </>
                )}

                {/* ─── LANGUAGE TAB ─── */}
                {activeSettingsTab === "language" && (
                  <>
                    <Column style={{ gap: "4px" }}>
                      <Heading
                        variant="heading-strong-m"
                        style={{ color: "#1C1C1E" }}
                      >
                        Ngôn ngữ (Language)
                      </Heading>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.8rem",
                        }}
                      >
                        Chọn ngôn ngữ hiển thị
                      </Text>
                    </Column>
                    <Column style={{ gap: "8px" }}>
                      {[
                        {
                          code: "vi",
                          label: "Tiếng Việt",
                          flag: "🇻🇳",
                          active: true,
                        },
                        {
                          code: "en",
                          label: "English",
                          flag: "🇺🇸",
                          active: false,
                        },
                        {
                          code: "ja",
                          label: "日本語",
                          flag: "🇯🇵",
                          active: false,
                        },
                        {
                          code: "ko",
                          label: "한국어",
                          flag: "🇰🇷",
                          active: false,
                        },
                      ].map((lang) => (
                        <Row
                          key={lang.code}
                          onClick={handleComingSoon}
                          style={{
                            padding: "14px 16px",
                            gap: "14px",
                            alignItems: "center",
                            borderRadius: "12px",
                            cursor: "pointer",
                            backgroundColor: lang.active
                              ? "rgba(0,209,178,0.08)"
                              : "rgba(255,255,255,0.03)",
                            border: lang.active
                              ? "1px solid rgba(0,209,178,0.3)"
                              : "1px solid rgba(255,255,255,0.06)",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>
                            {lang.flag}
                          </span>
                          <Text
                            style={{
                              color: lang.active
                                ? "white"
                                : "rgba(255,255,255,0.6)",
                              fontWeight: lang.active ? 600 : 400,
                              fontSize: "0.9rem",
                              flex: 1,
                            }}
                          >
                            {lang.label}
                          </Text>
                          {lang.active && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#00D1B2",
                              }}
                            />
                          )}
                        </Row>
                      ))}
                    </Column>
                  </>
                )}

                {/* ─── NOTIFICATIONS TAB ─── */}
                {activeSettingsTab === "notifications" && (
                  <>
                    <Column style={{ gap: "4px" }}>
                      <Heading
                        variant="heading-strong-m"
                        style={{ color: "#1C1C1E" }}
                      >
                        Thông báo (Notifications)
                      </Heading>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.8rem",
                        }}
                      >
                        Quản lý cài đặt thông báo
                      </Text>
                    </Column>
                    <Column style={{ gap: "8px" }}>
                      {[
                        {
                          label: "Bạn bè check-in gần đây",
                          desc: "Nhận thông báo khi bạn bè check-in",
                          on: true,
                        },
                        {
                          label: "Khuyến mãi lân cận",
                          desc: "Ưu đãi từ các quán xung quanh",
                          on: true,
                        },
                        {
                          label: "Taste Vector cập nhật",
                          desc: "Khi vector sở thích thay đổi",
                          on: false,
                        },
                        {
                          label: "Lời mời Lobby",
                          desc: "Khi bạn được mời vào nhóm",
                          on: true,
                        },
                      ].map((noti) => (
                        <Row
                          key={noti.label}
                          style={{
                            padding: "16px",
                            gap: "16px",
                            alignItems: "center",
                            borderRadius: "12px",
                            backgroundColor: "#F2F2F7",
                            border: "1px solid #E5E5EA",
                          }}
                        >
                          <Column style={{ flex: 1, gap: "2px" }}>
                            <Text
                              style={{
                                color: "#1C1C1E",
                                fontWeight: 500,
                                fontSize: "0.85rem",
                              }}
                            >
                              {noti.label}
                            </Text>
                            <Text
                              style={{
                                color: "#AEAEB2",
                                fontSize: "0.75rem",
                              }}
                            >
                              {noti.desc}
                            </Text>
                          </Column>
                          {/* Toggle Switch */}
                          <div
                            onClick={handleComingSoon}
                            style={{
                              width: "44px",
                              height: "24px",
                              borderRadius: "12px",
                              backgroundColor: noti.on
                                ? "#00D1B2"
                                : "#E5E5EA",
                              position: "relative",
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "3px",
                                left: noti.on ? "23px" : "3px",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                backgroundColor: "#1C1C1E",
                                transition: "left 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              }}
                            />
                          </div>
                        </Row>
                      ))}
                    </Column>
                  </>
                )}

                {/* ─── SUPPORT TAB ─── */}
                {activeSettingsTab === "support" && (
                  <>
                    <Column style={{ gap: "4px" }}>
                      <Heading
                        variant="heading-strong-m"
                        style={{ color: "#1C1C1E" }}
                      >
                        Trợ giúp & Hỗ trợ
                      </Heading>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.8rem",
                        }}
                      >
                        Liên hệ hoặc tìm câu trả lời
                      </Text>
                    </Column>

                    {/* Contact Card */}
                    <Column
                      style={{
                        padding: "24px",
                        borderRadius: "14px",
                        background:
                          "linear-gradient(135deg, rgba(0,209,178,0.1) 0%, rgba(168,85,247,0.08) 100%)",
                        border: "1px solid rgba(0,209,178,0.15)",
                        gap: "12px",
                      }}
                    >
                      <Heading
                        variant="heading-strong-s"
                        style={{ color: "#1C1C1E" }}
                      >
                        Cần hỗ trợ?
                      </Heading>
                      <Text
                        style={{
                          color: "#8E8E93",
                          fontSize: "0.8rem",
                        }}
                      >
                        Email: support@tastemap.io
                      </Text>
                      <Button
                        size="m"
                        onClick={handleComingSoon}
                        style={{
                          backgroundColor: "#00D1B2",
                          color: "#000",
                          fontWeight: 700,
                          borderRadius: "10px",
                          padding: "10px 20px",
                          cursor: "pointer",
                          border: "none",
                          alignSelf: "flex-start",
                        }}
                      >
                        <LifeBuoy size={14} style={{ marginRight: "8px" }} />{" "}
                        Start Live Chat
                      </Button>
                    </Column>

                    {/* FAQ */}
                    <Column style={{ gap: "8px" }}>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Câu hỏi thường gặp
                      </Text>
                      {[
                        {
                          q: "Làm sao để sửa Taste Vector?",
                          a: "Hãy tiếp tục swipe để hệ thống tự động tối ưu theo sở thích của bạn.",
                        },
                        {
                          q: "Tôi có thể tạo bao nhiêu Tour?",
                          a: "Không giới hạn! Bạn có thể tạo và lưu nhiều tour khác nhau.",
                        },
                        {
                          q: "Dữ liệu có được bảo mật không?",
                          a: "Tất cả dữ liệu được mã hóa end-to-end và lưu trữ an toàn.",
                        },
                      ].map((faq) => (
                        <Column
                          key={faq.q}
                          style={{
                            padding: "16px",
                            borderRadius: "12px",
                            backgroundColor: "#F2F2F7",
                            border: "1px solid #E5E5EA",
                            gap: "8px",
                          }}
                        >
                          <Text
                            style={{
                              color: "#1C1C1E",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                            }}
                          >
                            {faq.q}
                          </Text>
                          <Text
                            style={{
                              color: "#8E8E93",
                              fontSize: "0.8rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {faq.a}
                          </Text>
                        </Column>
                      ))}
                    </Column>
                  </>
                )}

                {/* ─── ABOUT TAB ─── */}
                {activeSettingsTab === "about" && (
                  <>
                    <Column style={{ gap: "4px" }}>
                      <Heading
                        variant="heading-strong-m"
                        style={{ color: "#1C1C1E" }}
                      >
                        Về TasteMap
                      </Heading>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.8rem",
                        }}
                      >
                        Thông tin ứng dụng
                      </Text>
                    </Column>

                    {/* App Info Card */}
                    <Column
                      style={{
                        padding: "24px",
                        borderRadius: "14px",
                        backgroundColor: "#F2F2F7",
                        border: "1px solid #E5E5EA",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <Heading
                        variant="heading-strong-l"
                        style={{ color: "#ED1B24", letterSpacing: "-0.5px" }}
                      >
                        TasteMap.
                      </Heading>
                      <Text
                        style={{
                          color: "#636366",
                          fontSize: "0.85rem",
                        }}
                      >
                        Food Tour Builder • Super App
                      </Text>
                      <Text
                        style={{
                          color: "#C7C7CC",
                          fontSize: "0.75rem",
                        }}
                      >
                        Version 1.0.0-beta (Build 2026.03)
                      </Text>
                    </Column>

                    {/* Links */}
                    <Column style={{ gap: "4px" }}>
                      <Text
                        style={{
                          color: "#AEAEB2",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "8px",
                        }}
                      >
                        Liên kết
                      </Text>
                      {[
                        {
                          label: "Github Repository",
                          icon: <Github size={16} />,
                        },
                        {
                          label: "Privacy Policy",
                          icon: <ExternalLink size={16} />,
                        },
                        {
                          label: "Terms of Service",
                          icon: <ExternalLink size={16} />,
                        },
                        {
                          label: "Open Source Licenses",
                          icon: <ExternalLink size={16} />,
                        },
                      ].map((link) => (
                        <Row
                          key={link.label}
                          onClick={handleComingSoon}
                          style={{
                            padding: "12px 16px",
                            gap: "14px",
                            alignItems: "center",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                            (e.currentTarget.style.backgroundColor =
                              "#F2F2F7")
                          }
                          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <div
                            style={{
                              color: "#AEAEB2",
                              display: "flex",
                            }}
                          >
                            {link.icon}
                          </div>
                          <Text
                            style={{
                              color: "#48484A",
                              fontSize: "0.85rem",
                              flex: 1,
                            }}
                          >
                            {link.label}
                          </Text>
                          <ChevronRight
                            size={14}
                            color="#D1D1D6"
                          />
                        </Row>
                      ))}
                    </Column>

                    {/* Credits */}
                    <Text
                      style={{
                        color: "#D1D1D6",
                        fontSize: "0.7rem",
                        textAlign: "center",
                        marginTop: "16px",
                      }}
                    >
                      Made with ❤️ by TasteMap Team • © 2026
                    </Text>
                  </>
                )}
              </Column>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

