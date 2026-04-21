"use client";

import React, { useState, useRef, useCallback } from "react";
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
  Grid,
} from "@/components/OnceUI";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Camera,
  X,
  Save,
  Lock,
  MapPin,
  Calendar,
  Star,
  Utensils,
  Award,
  Heart,
  Edit3,
  MessageCircle,
  UserPlus,
  Image as ImageIcon,
  Map as MapIcon,
  TrendingUp,
  Flame,
  Cake,
  Gem,
  Feather,
  PartyPopper,
  Users,
  Handshake,
  Share2,
  Link2,
  QrCode,
  Settings,
  Shield,
  Medal,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import ClientOnly from "@/components/common/ClientOnly";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useUserVector } from "@/context/UserVectorContext";
import { CreatePostModal, CreatePostCard } from "@/components/modals/CreatePostModal";
import { apiGet, apiUploadMedia, ApiError } from "@/lib/api";
import { useBadges } from "@/hooks/useBadges";
import BadgeCard from "@/components/features/gamification/BadgeCard";
import { FriendsListCard } from "@/components/features/profile/FriendsListCard";
import { ProfileTabs } from "@/components/features/profile/ProfileTabs";
import { QuickActionsCard } from "@/components/features/profile/QuickActionsCard";
import { TasteMapStatsCard } from "@/components/features/profile/TasteMapStatsCard";
import { TasteDNACard } from "@/components/features/profile/TasteDNACard";
import { TopHighlightsCard } from "@/components/features/profile/TopHighlightsCard";
import { EditProfileModal } from "@/components/features/profile/EditProfileModal";

// ═══════════ PROFILE PAGE ═══════════ //

const StatItem = ({
  value,
  label,
  delay,
}: {
  value: number | string;
  label: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay / 1000 }}
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <Text
      style={{
        color: "#1C1C1E",
        fontSize: "1.4rem",
        fontWeight: 800,
        letterSpacing: "-0.5px",
      }}
    >
      {typeof value === "number" && value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : value}
    </Text>
    <Text
      style={{
        color: "#8E8E93",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginTop: "2px",
      }}
    >
      {label}
    </Text>
  </motion.div>
);

// ─── Friend item from /api/v1/friends/foodies ───
export interface FriendItem {
  id: number;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  title?: string | null;
  match_score: number;
  friendship_id?: number | null;
}

// ─── Type for a single post/review item ───
export interface PostItem {
  id: number;
  user?: { id: number; display_name?: string; avatar_url?: string };
  location?: { id: number; name: string };
  review: string;
  rating?: number | null;
  image_url?: string | null;
  tags?: string[] | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const handleScroll = useCallback(() => {
    if (scrollRef.current) setShowSticky(scrollRef.current.scrollTop > 360);
  }, []);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, refetch } = useAuth();
  const { radarData } = useUserVector();
  const { badges, totalBadges, loading: badgesLoading } = useBadges();
  const [friendsList, setFriendsList] = useState<FriendItem[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsTotal, setPostsTotal] = useState(0);


  React.useEffect(() => {
    const fetchFriends = async () => {
      setFriendsLoading(true);
      try {
        // /api/v1/friends/foodies — bạn bè accepted + taste match score
        const data = await apiGet<{ items: FriendItem[] }>("/api/v1/friends/foodies");
        setFriendsList(data?.items || []);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      } finally {
        setFriendsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  // Fetch user's posts/reviews from backend
  React.useEffect(() => {
    if (!user?.id) return;
    const fetchUserPosts = async () => {
      setPostsLoading(true);
      try {
        const data = await apiGet<{ items: PostItem[]; total: number }>(
          `/api/v1/posts/?user_id=${user.id}&limit=50&offset=0`
        );
        setUserPosts(data?.items || []);
        setPostsTotal(data?.total || 0);
      } catch (err) {
        console.error("Failed to fetch user posts", err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchUserPosts();
  }, [user?.id]);

  const handleComingSoon = () =>
    toast("Will be updated in the next version 🚀");


  // Create Content Modal state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const handleOpenCreatePost = () => setIsCreatePostOpen(true);
  const handleCloseCreatePost = () => setIsCreatePostOpen(false);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="no-scrollbar"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: "120px",
      }}
    >
      {/* ── STICKY FLOATING BAR ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 0,
          overflow: "visible",
        }}
      >
        <AnimatePresence>
          {showSticky && (
            <motion.div
              initial={{ y: -72, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -72, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "40px",
                paddingRight: "40px",
                height: "64px",
                backgroundColor: "rgba(255,255,255,0.90)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <Row style={{ gap: "14px", alignItems: "center" }}>
                <Avatar
                  src={user?.avatar_url || ""}
                  size="s"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,107,53,0.2)",
                  }}
                />
                <Column style={{ gap: "1px" }}>
                  <Text
                    style={{
                      color: "#1C1C1E",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      lineHeight: 1,
                    }}
                  >
                    {user?.display_name || user?.username || ""}
                  </Text>
                  <Text
                    style={{
                      color: "#8E8E93",
                      fontSize: "0.78rem",
                      fontWeight: 500,
                    }}
                  >
                    @{user?.username || ""}
                  </Text>
                </Column>
              </Row>
              <Row style={{ gap: "10px" }}>
                <motion.button
                  onClick={handleComingSoon}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ff6b35, #e65721)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(255,107,53,0.28)",
                  }}
                >
                  <UserPlus size={15} /> Follow
                </motion.button>
                <motion.button
                  onClick={handleComingSoon}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,107,53,0.07)",
                    border: "1px solid rgba(255,107,53,0.12)",
                    cursor: "pointer",
                    color: "#ff6b35",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  <MessageCircle size={15} /> Message
                </motion.button>
              </Row>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ COVER PHOTO ═══ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "320px",
          flexShrink: 0,
        }}
      >
        <img
          src={
            user?.cover_url ||
            "https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&q=80"
          }
          alt="Cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.52) 100%)",
          }}
        />

        {/* Back Button */}
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            display: "flex",
          }}
        >
          <IconButton
            icon={<ChevronLeft size={20} color="#1C1C1E" />}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              borderRadius: "14px",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderRightWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(0,0,0,0.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Link>

        {/* Header Actions */}
        <Row
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Button
            size="s"
            onClick={() => setIsEditModalOpen(true)}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              borderRadius: "14px",
              color: "#1C1C1E",
              fontWeight: 700,
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
              cursor: "pointer",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderRightWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(0,0,0,0.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Row style={{ gap: "8px", alignItems: "center" }}>
              <Edit3 size={16} color="#ff6b35" />
              <Text style={{ fontSize: "0.85rem" }}>Edit Profile</Text>
            </Row>
          </Button>
          <IconButton
            icon={<Heart size={20} color="#ff6b35" />}
            onClick={handleComingSoon}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              borderRadius: "14px",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderRightWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(0,0,0,0.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Row>
      </div>

      {/* ═══ PROFILE HEADER ═══ */}
      <Column
        fillWidth
        style={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "40px",
          paddingRight: "40px",
          marginTop: "-100px",
          zIndex: 10,
        }}
      >
        {/* Avatar Area with Animated Gradient Frame */}
        <Row fillWidth style={{ marginBottom: "32px" }}>
          <div style={{ position: "relative", padding: "6px" }}>
            {/* Animated Gradient Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #ff6b35, #ff8c5a, #ffaa7a, #ff6b35)",
                padding: "4px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </motion.div>

            {/* Glow Effect */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,107,53,0.3)",
                  "0 0 40px rgba(255,107,53,0.5)",
                  "0 0 20px rgba(255,107,53,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "-4px",
                left: "-4px",
                right: "-4px",
                bottom: "-4px",
                borderRadius: "50%",
                zIndex: -1,
              }}
            />

            <Avatar
              src={user?.avatar_url || ""}
              size="xl"
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                border: "4px solid #FFFFFF",
                position: "relative",
                zIndex: 1,
              }}
            />

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.5,
              }}
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                background: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
                borderRadius: "14px",
                padding: "6px 12px",
                border: "3px solid #FFFFFF",
                boxShadow: "0 4px 16px rgba(255,107,53,0.4)",
                zIndex: 2,
              }}
            >
              <Text
                style={{ color: "white", fontSize: "0.75rem", fontWeight: 800 }}
              >
                LV {user?.level || 1}
              </Text>
            </motion.div>
          </div>
        </Row>


        {/* ── STATS ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            alignItems: "stretch",
            marginBottom: "48px",
          }}
        >
          {/* ══ LEFT/CENTER COLUMN (col-span-2) ══ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Profile Identity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "28px",
                border: "1px solid #F2F2F7",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <Row
                style={{
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Heading
                  variant="display-strong-s"
                  style={{
                    color: "#1C1C1E",
                    fontSize: "2.2rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {user?.display_name || user?.username || "Guest"}
                </Heading>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
                  style={{
                    background: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
                    borderRadius: "50%",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Star size={12} color="white" fill="white" />
                </motion.div>
              </Row>

              <Row
                style={{
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Text
                  style={{
                    color: "#ff6b35",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  @{user?.username || "guest"}
                </Text>
                <span style={{ color: "#E5E5EA" }}>•</span>
                <div
                  style={{
                    background: "linear-gradient(135deg, #FFF0E6, #FFE8D6)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,107,53,0.15)",
                  }}
                >
                  <Text
                    style={{
                      color: "#ff6b35",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    {user?.title || "Taste Explorer"}
                  </Text>
                </div>
              </Row>

              <Text
                style={{
                  color: "#48484A",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  maxWidth: "600px",
                }}
              >
                {user?.bio ||
                  "Exploring flavors, one bite at a time. Join me on this delicious journey!"}
              </Text>
            </motion.div>

            {/* Bento Pills Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #F2F2F7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <Row
                  style={{
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <Flame size={14} color="white" />
                  </div>
                  <Text
                    style={{
                      color: "#1C1C1E",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    Level {user?.level || 1}
                  </Text>
                </Row>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "#F2F2F7",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(((user?.xp || 0) / ((user?.level || 1) * 1000)) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #ff6b35, #ff8c5a)",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <Text
                  style={{
                    color: "#8E8E93",
                    fontSize: "0.75rem",
                    marginTop: "6px",
                  }}
                >
                  {user?.xp || 0} / {(user?.level || 1) * 1000} XP
                </Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                whileHover={{ y: -2 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #F2F2F7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                }}
              >
                <Row style={{ gap: "10px", alignItems: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#F2F2F7",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                  >
                    <MapPin size={16} color="#ff6b35" />
                  </div>
                  <Column>
                    <Text
                      style={{
                        color: "#8E8E93",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Location
                    </Text>
                    <Text
                      style={{
                        color: "#1C1C1E",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {user?.location || "Exploring"}
                    </Text>
                  </Column>
                </Row>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #F2F2F7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <Row style={{ gap: "10px", alignItems: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#F2F2F7",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                  >
                    <Calendar size={16} color="#8E8E93" />
                  </div>
                  <Column>
                    <Text
                      style={{
                        color: "#8E8E93",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Member Since
                    </Text>
                    <Text
                      style={{
                        color: "#1C1C1E",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )
                        : "Mar 2025"}
                    </Text>
                  </Column>
                </Row>
              </motion.div>
            </div>

            {/* Favorite Tastes Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                border: "1px solid #F2F2F7",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <Row
                style={{
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Heart size={18} color="#ff6b35" />
                <Text
                  style={{
                    color: "#1C1C1E",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  Flavor Profile
                </Text>
              </Row>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                {[
                  { emoji: "🌶️", label: "Spicy", value: 85, color: "#FF3B30" },
                  { emoji: "🍰", label: "Sweet", value: 60, color: "#FF9500" },
                  { emoji: "🥬", label: "Vegan", value: 40, color: "#34C759" },
                  { emoji: "🧂", label: "Savory", value: 72, color: "#5856D6" },
                  { emoji: "🍤", label: "Crispy", value: 55, color: "#FF6B35" },
                  { emoji: "🍜", label: "Umami", value: 68, color: "#AF52DE" },
                ].map((taste, i) => (
                  <motion.div
                    key={taste.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                    whileHover={{ scale: 1.03, backgroundColor: "#FAFAFA" }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "14px",
                      backgroundColor: "#F9F9FB",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.3rem",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {taste.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Row
                        style={{
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <Text
                          style={{
                            color: "#1C1C1E",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                          }}
                        >
                          {taste.label}
                        </Text>
                        <Text
                          style={{
                            color: taste.color,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          {taste.value}%
                        </Text>
                      </Row>
                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          backgroundColor: "#ECECEE",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${taste.value}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.7 + i * 0.08,
                            ease: "easeOut",
                          }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${taste.color}, ${taste.color}aa)`,
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <FriendsListCard
              friendsList={friendsList}
              friendsLoading={friendsLoading}
              onSeeAll={handleComingSoon}
            />

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Create Post Card */}
            <CreatePostCard onOpenCreatePost={handleOpenCreatePost} />

            {/* Quick Actions Card */}
            <QuickActionsCard onAction={handleComingSoon} />

            {/* TasteMap Stats Card */}
            <TasteMapStatsCard user={user} />


          </div>
        </div>

        {/* ═══ TASTE DNA SECTION ═══ */}
        <Row fillWidth style={{ gap: "24px", marginBottom: "48px" }}>
          {/* Radar Chart Card */}
          <TasteDNACard radarData={radarData} />

          {/* Top Traits Card */}
          <TopHighlightsCard radarData={radarData} />
        </Row>

        {/* ═══ TABS SECTION ═══ */}
        <ProfileTabs
          postsLoading={postsLoading}
          userPosts={userPosts}
          badges={badges}
          totalBadges={totalBadges}
          badgesLoading={badgesLoading}
        />
      </Column>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSuccess={refetch}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={handleCloseCreatePost}
        onPostCreated={(event) => {
          if (event.type === "post") {
            toast.success("Foodie Feed post published successfully.");
            return;
          }
          toast.success("Discover reel published. Open Discover to view it.");
        }}
      />
    </div>
  );
}
