import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Column, Heading, IconButton, Button } from "@/components/OnceUI";
import { MessageCircle, SlidersHorizontal } from "lucide-react";
import { PostCard } from "@/components/cards/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/StaggerContainer";
import { usePosts } from "@/hooks/usePosts";
import { PostData } from "@/types/dashboard";
import { SkeletonFeedCard } from "@/components/Skeletons";

interface FoodieFeedProps {
  onPostClick: (post: PostData) => void;
  isLoading?: boolean;
}

import { useSocialStore } from "@/store/socialStore";
import { apiPost } from "@/lib/api";

export const FoodieFeed: React.FC<FoodieFeedProps> = ({ onPostClick }) => {
  const { posts, loading, error } = usePosts(8);
  const updatePost = useSocialStore((state) => state.updatePost);

  const handleToggleLike = async (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const newIsLiked = !post.isLiked;
    const newLikes = newIsLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
    updatePost(id, { isLiked: newIsLiked, likes: newLikes });
    try {
      await apiPost(`/api/v1/posts/${id}/like`, {});
    } catch (e) {
      updatePost(id, { isLiked: post.isLiked, likes: post.likes });
    }
  };

  const renderContent = () => {
    if (loading) {
      return [1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            minWidth: 260,
            height: 320,
            borderRadius: 20,
            flexShrink: 0,
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
      ));
    }

    if (error) {
      return (
        <p style={{ color: "#8E8E93", fontSize: "0.85rem", padding: "8px 0" }}>
          Lỗi tải bài đăng: {error}
        </p>
      );
    }

    if (posts.length === 0) {
      return (
        <p style={{ color: "#8E8E93", fontSize: "0.85rem", padding: "8px 0" }}>
          Chưa có bài đăng nào. Hãy đăng bài đầu tiên!
        </p>
      );
    }

    return (
      <StaggerContainer
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          paddingBottom: "8px",
        }}
      >
        {posts.map((post, idx) => (
          <StaggerItem key={idx}>
            <div onClick={() => onPostClick(post)}>
              <PostCard {...post} delay={0} onToggleLike={handleToggleLike} />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    );
  };

  return (
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
              icon={<SlidersHorizontal size={18} color="#8E8E93" />}
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
          }}
        >
          {renderContent()}
        </Row>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </Column>
    </motion.div>
  );
};
