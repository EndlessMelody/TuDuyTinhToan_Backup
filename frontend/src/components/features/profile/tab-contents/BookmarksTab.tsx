"use client";

import React from "react";
import { Column, Row, Text, Grid } from "@/components/OnceUI";
import { Bookmark, MapPin, PlayCircle, FileText } from "lucide-react";
import { apiGet } from "@/lib/api";
import { tokens } from "@/styles/tokens";
import { GlassCard } from "@/components/primitives";

export const BookmarksTab: React.FC = () => {
  const [bookmarks, setBookmarks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res: any = await apiGet("/api/v1/bookmarks?limit=50");
        setBookmarks(res.items || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <Column fillWidth style={{ padding: "40px", alignItems: "center" }}>
        <Text style={{ color: tokens.color.textMuted }}>Loading your vault...</Text>
      </Column>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Column
        fillWidth
        style={{
          gap: "20px",
          height: "400px",
          backgroundColor: "#FFFFFF",
          border: `1px solid ${tokens.color.border}`,
          borderRadius: "32px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bookmark size={48} color={tokens.color.warm} style={{ opacity: 0.2 }} />
        <Text style={{ color: tokens.color.textMuted, fontWeight: 500 }}>
          Your Taste Vault is empty.
        </Text>
        <Text style={{ color: tokens.color.textMuted, fontSize: "0.9rem" }}>
          Save spots, posts, or reels to see them here.
        </Text>
      </Column>
    );
  }

  return (
    <Grid columns="repeat(auto-fill, minmax(280px, 1fr))" style={{ gap: "24px" }}>
      {bookmarks.map((bm) => {
        let title = "Unknown";
        let type = "Other";
        let icon = <Bookmark size={16} />;
        let img = "https://images.unsplash.com/photo-1544025162-d76694265947?w=520&h=360&fit=crop";
        let subtitle = "";

        if (bm.location) {
          title = bm.location.name;
          type = "Location";
          icon = <MapPin size={16} />;
          img = bm.location.image_url || img;
          subtitle = `${bm.location.category || "Food"} • ${bm.location.price_range || "$$"}`;
        } else if (bm.post) {
          title = "Saved Post";
          type = "Post";
          icon = <FileText size={16} />;
          img = bm.post.image_url || img;
          subtitle = bm.post.review || "User review";
        } else if (bm.reel) {
          title = bm.reel.title || "Saved Reel";
          type = "Reel";
          icon = <PlayCircle size={16} />;
          img = bm.reel.thumbnail_url || img;
          subtitle = "Discover Video";
        }

        return (
          <GlassCard
            key={bm.id}
            variant="elevated"
            padding="none"
            radius="xl"
            interactive
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div style={{ position: "relative", width: "100%", height: "160px" }}>
              <img
                src={img}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: tokens.color.warm,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {icon}
                {type.toUpperCase()}
              </div>
            </div>
            <Column style={{ padding: "16px", gap: "4px" }}>
              <Text style={{ fontWeight: 700, fontSize: "1.1rem" }} oneliner>
                {title}
              </Text>
              <Text style={{ fontSize: "0.85rem", color: tokens.color.textMuted }} oneliner>
                {subtitle}
              </Text>
            </Column>
          </GlassCard>
        );
      })}
    </Grid>
  );
};
