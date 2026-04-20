"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Heading, Text, Input, IconButton } from "@/components/OnceUI";
import { useAuth } from "@/context/AuthContext";
import { apiPost, apiGet } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-utils";
import MapWidget from "@/components/MapWidget";
import { Fraunces, Manrope } from "next/font/google";
import {
  Search,
  Camera,
  BookOpen,
  Sparkles,
  Clock,
  Wine,
  Lightbulb,
  X,
  Loader2,
  Globe,
  ChevronRight,
  Flame,
  MapPin,
  Tag,
} from "lucide-react";

const displayFont = Fraunces({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface CultureStorySection {
  title: string;
  content: string;
  icon?: string | null;
}

interface CultureStoryResponse {
  food_name: string;
  food_name_local?: string | null;
  identified_from_image: boolean;
  confidence?: number | null;
  image_url?: string | null;
  sections: CultureStorySection[];
  taste_tags: string[];
  pairing_suggestions: string[];
  when_to_eat?: string | null;
  fun_fact?: string | null;
}

interface LocationItem {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address?: string | null;
  city?: string | null;
  category?: string | null;
  image_url?: string | null;
  price_range?: string | null;
  open_hours?: string | null;
  rating?: number | null;
  characteristics?: Record<string, unknown> | null;
}

interface LocationListResponse {
  items: LocationItem[];
  total: number;
  limit: number;
  offset: number;
}

// ─── Section Icon Map ─────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Origin Story": <Globe size={18} />,
  "Cultural Significance": <BookOpen size={18} />,
  "How Locals Eat It": <Sparkles size={18} />,
  "The Science of Flavor": <Lightbulb size={18} />,
  Origin: <Globe size={18} />,
  History: <BookOpen size={18} />,
  Flavor: <Sparkles size={18} />,
  Taste: <Sparkles size={18} />,
  Preparation: <Lightbulb size={18} />,
  Cooking: <Flame size={18} />,
  Seasonal: <Clock size={18} />,
  "Best Places": <MapPin size={18} />,
};

// ─── Suggested Dishes ─────────────────────────────────────────────────────────

const SUGGESTED_DISHES = [
  {
    name: "Phở",
    emoji: "🍜",
    tag: "National Soul",
    mood: "Slow-simmer comfort",
  },
  {
    name: "Bánh Mì",
    emoji: "🥖",
    tag: "Street Icon",
    mood: "Crunchy, bold, portable",
  },
  {
    name: "Bún Chả",
    emoji: "🥢",
    tag: "Hanoi Classic",
    mood: "Smoky grill ritual",
  },
  {
    name: "Cơm Tấm",
    emoji: "🍚",
    tag: "Saigon Soul",
    mood: "Everyday comfort plate",
  },
  {
    name: "Bánh Xèo",
    emoji: "🥞",
    tag: "Golden Crispy",
    mood: "Sizzle and fresh herbs",
  },
  {
    name: "Gỏi Cuốn",
    emoji: "🥟",
    tag: "Fresh Roll",
    mood: "Light, bright, herbal",
  },
  {
    name: "Cà Phê Sữa Đá",
    emoji: "☕",
    tag: "Essential",
    mood: "Bittersweet energy",
  },
  {
    name: "Hủ Tiếu",
    emoji: "🍲",
    tag: "Southern Bowl",
    mood: "Clear broth and aroma",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CulturePage() {
  useAuth(); // ensures auth context is loaded
  const [searchQuery, setSearchQuery] = useState("");
  const [story, setStory] = useState<CultureStoryResponse | null>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map center based on locations or default to Vietnam center
  const mapCenter: [number, number] = useMemo(() => {
    if (locations.length > 0) {
      // Calculate centroid of all locations
      const avgLat =
        locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
      const avgLng =
        locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
      return [avgLat, avgLng];
    }
    return [10.897, 106.772]; // Default: Vung Tau area
  }, [locations]);

  // Map points from locations
  const mapPoints: [number, number][] = useMemo(() => {
    return locations.map((loc) => [loc.lat, loc.lng]);
  }, [locations]);

  const handleSearch = async (foodName?: string) => {
    const query = foodName || searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setStory(null);
    setLocations([]);
    setActiveSection(0);

    try {
      // Fetch culture story and locations in parallel
      const [storyResult, locationsResult] = await Promise.all([
        apiPost<CultureStoryResponse>("/api/v1/culture/story", {
          food_name: query,
          language: "vi",
        }),
        apiGet<LocationListResponse>(
          `/api/v1/locations/by-food/${encodeURIComponent(query)}?limit=12`,
        ),
      ]);

      setStory(storyResult);
      setLocations(locationsResult.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to generate story. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setStory(null);
    setActiveSection(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", "vi");

      // Use fetch directly for multipart
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "http://127.0.0.1:8000";

      const { supabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(
        `${BASE_URL}/api/v1/culture/identify-upload?language=vi`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const result: CultureStoryResponse = await res.json();
      setStory(result);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to identify dish from image.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const previewImageUrl = story ? normalizeImageUrl(story.image_url) : null;
  const hasStoryMeta = Boolean(
    story?.identified_from_image || story?.confidence != null,
  );

  return (
    <div
      className={bodyFont.className}
      style={{
        minHeight: "100vh",
        height: "100vh",
        overflowY: "auto",
        position: "relative",
        padding: "clamp(20px, 3vw, 36px) clamp(14px, 2.2vw, 30px) 56px",
        background:
          "radial-gradient(circle at 16% 6%, rgba(255,184,122,0.25), transparent 34%), radial-gradient(circle at 88% 14%, rgba(255,122,69,0.22), transparent 38%), linear-gradient(180deg, #fff9f2 0%, #fff4e8 52%, #ffefe0 100%)",
      }}
    >
      <div
        aria-hidden
        className="culture-floating-orb"
        style={{
          position: "absolute",
          top: 86,
          right: "7vw",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,153,77,0.44) 0%, rgba(255,153,77,0) 72%)",
          pointerEvents: "none",
          filter: "blur(0.5px)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="culture-floating-orb-delayed"
        style={{
          position: "absolute",
          top: 320,
          left: "5vw",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,216,145,0.38) 0%, rgba(255,216,145,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(90deg, rgba(135,73,37,0.2) 1px, transparent 1px), linear-gradient(rgba(135,73,37,0.2) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          zIndex: 0,
        }}
      />

      {/* ─── Hero / Search ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            borderRadius: 28,
            padding: "clamp(20px, 3vw, 34px)",
            background:
              "linear-gradient(132deg, rgba(255,255,255,0.86) 0%, rgba(255,249,239,0.94) 100%)",
            border: "1px solid rgba(255,167,103,0.34)",
            boxShadow:
              "0 26px 56px rgba(168, 90, 37, 0.12), inset 0 1px 0 rgba(255,255,255,0.84)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div>
            <Row style={{ alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(219,102,39,0.24)",
                  backgroundColor: "rgba(255,122,69,0.1)",
                  color: "#a6451f",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                }}
              >
                Culture Lens
              </span>
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(180,114,46,0.18)",
                  backgroundColor: "rgba(255,226,177,0.4)",
                  color: "#8f501c",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                }}
              >
                TasteMap Signature
              </span>
            </Row>

            <div className={displayFont.className}>
              <Heading
                variant="heading-strong-xl"
                style={{
                  color: "#26140d",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4.1vw, 3.45rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.03em",
                  marginBottom: 12,
                }}
              >
                Culinary Culture Guide
              </Heading>
            </div>

            <Text
              style={{
                color: "#664233",
                fontSize: "clamp(0.95rem, 1.5vw, 1.04rem)",
                lineHeight: 1.7,
                maxWidth: 620,
              }}
            >
              Every dish has roots, rituals, and stories. Type a name or drop a
              photo, then let AI unveil the memory and meaning behind what you
              are about to taste.
            </Text>
          </div>

          <div
            style={{
              borderRadius: 20,
              padding: "18px 18px 16px",
              background:
                "linear-gradient(150deg, rgba(255,152,96,0.12) 0%, rgba(255,227,188,0.45) 100%)",
              border: "1px solid rgba(227,121,63,0.22)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <Text
              style={{
                color: "#9a4d1d",
                fontSize: "0.73rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Why it feels different
            </Text>
            <Row style={{ alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <Flame size={15} color="#cf5a21" style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontSize: "0.85rem",
                  color: "#553325",
                  lineHeight: 1.5,
                }}
              >
                Stories are structured into origin, local habits, and flavor
                science.
              </Text>
            </Row>
            <Row style={{ alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <Sparkles size={15} color="#cf5a21" style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontSize: "0.85rem",
                  color: "#553325",
                  lineHeight: 1.5,
                }}
              >
                The interface highlights mood and context, not just plain facts.
              </Text>
            </Row>
            <Row style={{ alignItems: "flex-start", gap: 8 }}>
              <MapPin size={15} color="#cf5a21" style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontSize: "0.85rem",
                  color: "#553325",
                  lineHeight: 1.5,
                }}
              >
                Built for mobile and desktop with the same visual rhythm.
              </Text>
            </Row>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 22,
            padding: "16px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.84) 0%, rgba(255,245,232,0.84) 100%)",
            border: "1px solid rgba(230,140,75,0.25)",
            boxShadow:
              "0 16px 40px rgba(152, 84, 37, 0.1), inset 0 1px 0 rgba(255,255,255,0.78)",
          }}
        >
          <Row
            style={{
              gap: 10,
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ flex: "1 1 260px", minWidth: 220, position: "relative" }}
            >
              <Input
                placeholder="Type a dish name... (e.g. Phở, Bánh Mì)"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent) =>
                  e.key === "Enter" && handleSearch()
                }
                style={{
                  width: "100%",
                  borderRadius: 16,
                  minHeight: 52,
                  paddingTop: 14,
                  paddingBottom: 14,
                  paddingLeft: 48,
                  paddingRight: 16,
                  fontSize: "0.96rem",
                  border: "1.5px solid rgba(222,149,98,0.3)",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: "#2d1a11",
                }}
              />
              <Search
                size={18}
                color="#9f6543"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            <IconButton
              icon={<Camera size={20} color="#bc4f1c" />}
              variant="tertiary"
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: 14,
                width: 52,
                minHeight: 52,
                border: "1.5px solid rgba(221,149,97,0.4)",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            />

            <IconButton
              icon={
                loading ? (
                  <Loader2 size={20} color="#bc4f1c" className="animate-spin" />
                ) : (
                  <Sparkles size={20} color="#bc4f1c" />
                )
              }
              variant="tertiary"
              onClick={() => handleSearch()}
              disabled={loading}
              style={{
                borderRadius: 14,
                width: 52,
                minHeight: 52,
                border: "1.5px solid #d6622a",
                background: loading
                  ? "rgba(245,232,224,0.8)"
                  : "linear-gradient(140deg, rgba(255,177,135,0.32), rgba(255,125,67,0.14))",
              }}
            />
          </Row>

          <Row
            style={{
              marginTop: 12,
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Row style={{ alignItems: "center", gap: 6 }}>
              <Flame size={13} color="#c55a20" />
              <Text
                style={{
                  fontSize: "0.76rem",
                  color: "#8f5a3f",
                  fontWeight: 600,
                }}
              >
                Street-food stories with local context
              </Text>
            </Row>
            <Row style={{ alignItems: "center", gap: 6 }}>
              <MapPin size={13} color="#c55a20" />
              <Text
                style={{
                  fontSize: "0.76rem",
                  color: "#8f5a3f",
                  fontWeight: 600,
                }}
              >
                Snap a photo for instant dish identification
              </Text>
            </Row>
          </Row>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </motion.div>

      {/* ─── Suggested Dishes (when no story) ─── */}
      {!story && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          style={{
            maxWidth: 1080,
            margin: "24px auto 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                color: "#9e603b",
                fontSize: "0.74rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
              }}
            >
              Popular Dishes
            </Text>
            <Text
              style={{ color: "#aa7455", fontSize: "0.78rem", fontWeight: 600 }}
            >
              Tap any card to explore instantly
            </Text>
          </Row>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12,
            }}
          >
            {SUGGESTED_DISHES.map((dish) => (
              <motion.button
                key={dish.name}
                className="culture-dish-card"
                onClick={() => {
                  setSearchQuery(dish.name);
                  handleSearch(dish.name);
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(225, 147, 95, 0.34)",
                  padding: "12px 12px 11px",
                  textAlign: "left",
                  cursor: "pointer",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,247,237,0.92))",
                  boxShadow: "0 9px 22px rgba(151, 86, 42, 0.08)",
                }}
              >
                <Row style={{ alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: "1.28rem", lineHeight: 1 }}>
                    {dish.emoji}
                  </span>
                  <Text
                    style={{
                      color: "#2b170e",
                      fontWeight: 800,
                      fontSize: "0.93rem",
                    }}
                  >
                    {dish.name}
                  </Text>
                </Row>

                <Text
                  style={{
                    display: "inline-block",
                    borderRadius: 999,
                    padding: "3px 8px",
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    color: "#bb4f1d",
                    backgroundColor: "rgba(255,130,70,0.12)",
                    border: "1px solid rgba(221,102,42,0.2)",
                  }}
                >
                  {dish.tag}
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    color: "#82503a",
                    fontSize: "0.75rem",
                    lineHeight: 1.45,
                  }}
                >
                  {dish.mood}
                </Text>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "46px 0 10px",
            maxWidth: 1080,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background:
                "linear-gradient(145deg, rgba(255,190,145,0.28), rgba(255,132,74,0.14))",
              border: "1px solid rgba(220,112,55,0.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <Loader2 size={28} color="#d15a23" className="animate-spin" />
          </div>
          <Text
            style={{ color: "#925b3c", fontSize: "0.9rem", fontWeight: 600 }}
          >
            Uncovering the story behind your dish...
          </Text>
        </motion.div>
      )}

      {/* ─── Error ─── */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            maxWidth: 880,
            margin: "22px auto 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              borderRadius: 18,
              padding: "18px 20px",
              border: "1px solid rgba(226,90,55,0.35)",
              background:
                "linear-gradient(145deg, rgba(255,244,239,0.95), rgba(255,234,222,0.95))",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <span style={{ fontSize: "1.42rem", lineHeight: 1 }}>😕</span>
            <div>
              <Text
                style={{
                  color: "#b6492f",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginBottom: 4,
                }}
              >
                We could not generate a story right now.
              </Text>
              <Text
                style={{
                  color: "#8a4e36",
                  fontSize: "0.83rem",
                  lineHeight: 1.55,
                }}
              >
                {error}
              </Text>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Story Card ─── */}
      <AnimatePresence mode="wait">
        {story && !loading && (
          <motion.div
            key={story.food_name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 250, damping: 24 }}
            style={{
              maxWidth: 1120,
              margin: "20px auto 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(318px, 1fr))",
              gap: 18,
              alignItems: "start",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ─── Left Column: Core Identity & Quick Tips ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Food Header */}
              <div
                className="culture-story-card"
                style={{
                  borderRadius: 22,
                  padding: "18px 18px 16px",
                  border: "1px solid rgba(224,143,92,0.28)",
                  background:
                    "linear-gradient(150deg, rgba(255,255,255,0.93) 0%, rgba(255,246,235,0.95) 100%)",
                  boxShadow:
                    "0 15px 34px rgba(143, 79, 39, 0.12), inset 0 1px 0 rgba(255,255,255,0.88)",
                }}
              >
                <Row
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: hasStoryMeta ? 8 : 2,
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <Row
                    style={{ alignItems: "center", gap: 8, flexWrap: "wrap" }}
                  >
                    {story.identified_from_image && (
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background:
                            "linear-gradient(120deg, rgba(255,125,67,0.14), rgba(255,168,110,0.2))",
                          border: "1px solid rgba(215,102,40,0.22)",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#be4d1b",
                        }}
                      >
                        📸 Identified from photo
                      </span>
                    )}

                    {story.confidence != null && (
                      <Text
                        style={{
                          fontSize: "0.72rem",
                          color: "#99684d",
                          fontWeight: 700,
                        }}
                      >
                        {Math.round(story.confidence * 100)}% confidence
                      </Text>
                    )}
                  </Row>

                  <IconButton
                    icon={<X size={16} color="#8d4f31" />}
                    variant="tertiary"
                    onClick={() => {
                      setStory(null);
                      setSearchQuery("");
                    }}
                    style={{
                      borderRadius: 10,
                      width: 34,
                      height: 34,
                      border: "1px solid rgba(214,131,84,0.3)",
                      backgroundColor: "rgba(255,255,255,0.78)",
                    }}
                  />
                </Row>

                <div className={displayFont.className}>
                  <Heading
                    variant="heading-strong-xl"
                    style={{
                      color: "#28130a",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontSize: "clamp(1.7rem, 3.1vw, 2.28rem)",
                      lineHeight: 1.1,
                      textAlign: "center",
                      marginTop: hasStoryMeta ? 0 : -8,
                      marginBottom: 2,
                    }}
                  >
                    {story.food_name}
                  </Heading>
                </div>

                {story.food_name_local &&
                  story.food_name_local !== story.food_name && (
                    <Text
                      style={{
                        color: "#8d6145",
                        fontSize: "0.94rem",
                        textAlign: "center",
                        marginBottom: 10,
                      }}
                    >
                      {story.food_name_local}
                    </Text>
                  )}

                {previewImageUrl && (
                  <div
                    style={{
                      marginBottom: 12,
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid rgba(224,145,94,0.3)",
                      boxShadow: "0 12px 24px rgba(131, 75, 41, 0.14)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <img
                      src={previewImageUrl}
                      alt={story.food_name}
                      style={{
                        width: "100%",
                        maxHeight: 240,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Tags & Insight Count */}
              {story.taste_tags.length > 0 && (
                <div
                  className="culture-story-card"
                  style={{
                    borderRadius: 16,
                    padding: "16px",
                    border: "1px solid rgba(255,167,103,0.35)",
                    background:
                      "linear-gradient(150deg, rgba(255,250,245,0.95), rgba(255,238,220,0.92))",
                  }}
                >
                  <Row
                    style={{ alignItems: "center", gap: 8, marginBottom: 10 }}
                  >
                    <Tag size={16} color="#d6622a" />
                    <Text
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: "#c9551f",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {story.sections.length} Insights
                    </Text>
                  </Row>
                  <Row style={{ flexWrap: "wrap", gap: 6 }}>
                    {story.taste_tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          background:
                            "linear-gradient(135deg, rgba(255,167,103,0.15), rgba(255,138,90,0.1))",
                          border: "1px solid rgba(214,105,48,0.25)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#a84a1a",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </Row>
                </div>
              )}

              {/* When to Eat */}
              {story.when_to_eat && (
                <div
                  className="culture-story-card"
                  style={{
                    borderRadius: 16,
                    padding: "16px",
                    border: "1px solid rgba(236,162,92,0.3)",
                    background:
                      "linear-gradient(150deg, rgba(255,255,255,0.88), rgba(255,246,229,0.9))",
                  }}
                >
                  <Row
                    style={{ alignItems: "center", gap: 8, marginBottom: 8 }}
                  >
                    <Clock size={16} color="#d57a1b" />
                    <Text
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: "#c96d17",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      When to Eat
                    </Text>
                  </Row>
                  <Text
                    style={{
                      color: "#593728",
                      fontSize: "0.86rem",
                      lineHeight: 1.58,
                    }}
                  >
                    {story.when_to_eat}
                  </Text>
                </div>
              )}

              {/* Pairing Suggestions */}
              {story.pairing_suggestions.length > 0 && (
                <div
                  className="culture-story-card"
                  style={{
                    borderRadius: 16,
                    padding: "16px",
                    border: "1px solid rgba(199,129,96,0.3)",
                    background:
                      "linear-gradient(150deg, rgba(255,255,255,0.9), rgba(255,240,232,0.88))",
                  }}
                >
                  <Row
                    style={{ alignItems: "center", gap: 8, marginBottom: 8 }}
                  >
                    <Wine size={16} color="#bb5336" />
                    <Text
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: "#b2472a",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Pairs Well With
                    </Text>
                  </Row>
                  {story.pairing_suggestions.map((s) => (
                    <Text
                      key={s}
                      style={{
                        color: "#5d3727",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                      }}
                    >
                      • {s}
                    </Text>
                  ))}
                </div>
              )}

              {/* Fun Fact */}
              {story.fun_fact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="culture-story-card"
                  style={{
                    borderRadius: 16,
                    padding: "16px",
                    background:
                      "linear-gradient(145deg, rgba(255, 242, 219, 0.84), rgba(255, 222, 170, 0.44))",
                    border: "1px solid rgba(226,146,68,0.25)",
                  }}
                >
                  <Row
                    style={{ alignItems: "center", gap: 8, marginBottom: 6 }}
                  >
                    <Lightbulb size={16} color="#c06c16" />
                    <Text
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: "#b45d12",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Fun Fact
                    </Text>
                  </Row>
                  <Text
                    style={{
                      color: "#5f3b24",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {story.fun_fact}
                  </Text>
                </motion.div>
              )}
            </div>

            {/* ─── Right Column: Information Sections ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  borderRadius: 16,
                  padding: "16px",
                  border: "1px solid rgba(226,146,92,0.24)",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.84), rgba(255,246,233,0.86))",
                }}
              >
                <Row style={{ alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Sparkles size={16} color="#bb5120" />
                  <Text
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: "#b54c1b",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Story Layers
                  </Text>
                </Row>
                <Text
                  style={{
                    color: "#7f5237",
                    fontSize: "0.82rem",
                    lineHeight: 1.52,
                  }}
                >
                  Expand each card to read how this dish connects to places,
                  people, and flavor traditions.
                </Text>
              </div>

              {story.sections.map((section, idx) => {
                const isActive = activeSection === idx;
                const previewText =
                  section.content.length > 122
                    ? `${section.content.slice(0, 122).trim()}...`
                    : section.content;

                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="culture-section-card"
                    style={{
                      borderRadius: 16,
                      padding: "16px",
                      border: isActive
                        ? "1px solid rgba(214,105,46,0.4)"
                        : "1px solid rgba(229,152,100,0.26)",
                      background: isActive
                        ? "linear-gradient(145deg, rgba(255,247,234,0.98), rgba(255,238,216,0.98))"
                        : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,248,238,0.88))",
                      cursor: "pointer",
                      boxShadow: isActive
                        ? "0 16px 28px rgba(163, 90, 42, 0.14)"
                        : "0 8px 18px rgba(141, 82, 42, 0.08)",
                    }}
                    onClick={() => setActiveSection(isActive ? -1 : idx)}
                  >
                    <Row
                      style={{
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "space-between",
                      }}
                    >
                      <Row style={{ alignItems: "center", gap: 10, flex: 1 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            backgroundColor: isActive
                              ? "rgba(214,105,46,0.14)"
                              : "rgba(210,121,57,0.09)",
                            border: "1px solid rgba(212,120,58,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {section.icon || SECTION_ICONS[section.title] || (
                            <BookOpen size={18} color="#b44c1c" />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <Heading
                            variant="heading-strong-s"
                            style={{
                              color: "#2a160d",
                              fontWeight: 700,
                              fontSize: "0.96rem",
                              lineHeight: 1.25,
                            }}
                          >
                            {section.title}
                          </Heading>
                          {!isActive && (
                            <Text
                              style={{
                                marginTop: 6,
                                color: "#7a4d34",
                                fontSize: "0.79rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {previewText}
                            </Text>
                          )}
                        </div>
                      </Row>

                      <motion.div
                        animate={{ rotate: isActive ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ alignSelf: "flex-start", marginTop: 4 }}
                      >
                        <ChevronRight size={17} color="#99634a" />
                      </motion.div>
                    </Row>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24 }}
                          style={{ overflow: "hidden" }}
                        >
                          <Text
                            style={{
                              color: "#503022",
                              fontSize: "0.88rem",
                              lineHeight: 1.72,
                              marginTop: 12,
                              paddingLeft: 48,
                            }}
                          >
                            {section.content}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Map Section - Real Locations */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="culture-story-card"
                style={{
                  borderRadius: 16,
                  padding: "16px",
                  border: "1px solid rgba(209,145,100,0.28)",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,246,235,0.94))",
                }}
              >
                <Row style={{ alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <MapPin size={16} color="#c76a2a" />
                  <Text
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: "#b85a1f",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {locations.length > 0
                      ? `${locations.length} Places to Try`
                      : "Places to Try"}
                  </Text>
                </Row>

                {/* Map with location points */}
                {locations.length > 0 && (
                  <div
                    style={{
                      height: 200,
                      borderRadius: 12,
                      overflow: "hidden",
                      marginBottom: 12,
                      border: "1px solid rgba(209,145,100,0.3)",
                    }}
                  >
                    <MapWidget
                      mapId="culture-map"
                      points={mapPoints}
                      center={mapCenter}
                      zoom={locations.length > 1 ? 11 : 14}
                      showBanner={false}
                      enableClustering={locations.length > 5}
                      mapStyleType="light"
                    />
                  </div>
                )}

                {/* Location Grid */}
                {locations.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 8,
                    }}
                  >
                    {locations.slice(0, 6).map((loc) => (
                      <motion.div
                        key={loc.id}
                        whileHover={{ scale: 1.02 }}
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          background: "#fff",
                          border: "1px solid rgba(209,145,100,0.2)",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={normalizeImageUrl(loc.image_url, {
                            id: loc.id,
                            category: loc.category || "food",
                          })}
                          alt={loc.name}
                          style={{
                            width: "100%",
                            height: 70,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div style={{ padding: "8px 10px" }}>
                          <Text
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#5a3d2b",
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {loc.name}
                          </Text>
                          {loc.city && (
                            <Text
                              style={{
                                fontSize: "0.68rem",
                                color: "#8f5a3f",
                                marginTop: 2,
                              }}
                            >
                              � {loc.city}
                            </Text>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Text
                    style={{
                      color: "#8f5a3f",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      padding: "20px 0",
                      fontStyle: "italic",
                    }}
                  >
                    No specific locations found — but this dish is available at
                    many local spots!
                  </Text>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .culture-floating-orb {
          animation: cultureFloat 9s ease-in-out infinite;
        }

        .culture-floating-orb-delayed {
          animation: cultureFloat 11s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        .culture-dish-card {
          transition:
            box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .culture-dish-card:hover {
          border-color: rgba(209, 92, 33, 0.44) !important;
          box-shadow: 0 18px 28px rgba(134, 72, 34, 0.16) !important;
        }

        .culture-story-card {
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .culture-story-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 28px rgba(128, 73, 37, 0.16);
        }

        .culture-section-card {
          transition:
            transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.26s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .culture-section-card:hover {
          transform: translateY(-2px);
        }

        @keyframes cultureFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -10px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (max-width: 740px) {
          .culture-dish-card {
            min-height: 126px;
          }
        }
      `}</style>
    </div>
  );
}
