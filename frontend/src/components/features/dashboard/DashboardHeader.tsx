import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionValue, useTransform } from "framer-motion";
import {
  Row,
  Column,
  Heading,
  Text,
  IconButton,
  Input,
  Avatar,
} from "@/components/OnceUI";
import {
  MapPin,
  Bell,
  MessageSquare,
  Sparkles,
  Compass,
} from "lucide-react";
import { ProfileMenuItem } from "@/components/common/ProfileMenuItem";
import { LogOut, User, Settings, Info, Palette, Globe, BellRing } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MOCK_USER } from "@/constants/mock-data";

interface DashboardHeaderProps {
  scrollY: MotionValue<number>;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onNotifClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  scrollY,
  onProfileClick,
  onSettingsClick,
  onNotifClick,
}) => {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Transforms for Dynamic Island effect
  const headerWidth = useTransform(scrollY, [0, 80], ["100%", "80%"]);
  const headerRadius = useTransform(scrollY, [0, 80], ["0px", "32px"]);
  const headerTop = useTransform(scrollY, [0, 80], ["0px", "12px"]);
  const headerPadding = useTransform(scrollY, [0, 80], ["14px 40px", "10px 24px"]);
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["none", "0 10px 30px -5px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.3)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0.05)", "rgba(0,0,0,0.1)"]
  );

  // New transforms for Profile "Trim" (ẩn tên)
  const profileTextOpacity = useTransform(scrollY, [0, 60], [1, 0]);
  const profileTextWidth = useTransform(scrollY, [0, 80], ["auto", "0px"]);
  const profileGap = useTransform(scrollY, [0, 80], ["12px", "0px"]);

  // Transforms for Search Expansion
  const searchWidth = useTransform(scrollY, [0, 80], ["420px", "480px"]);

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

  const handleComingSoon = () => toast("Will be updated in the next version 🚀");

  return (
    <motion.div
      className="sticky z-50 bg-white/80 backdrop-blur-xl noise-overlay"
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
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      animate={{
        scale: isSearchFocused ? 1.005 : 1,
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
          <Text style={{ color: "#1C1C1E", fontWeight: 600, fontSize: "0.82rem" }}>
            {MOCK_USER.location}
          </Text>
          <span style={{ color: "#C7C7CC", fontSize: "0.7rem", marginLeft: "2px" }}>▼</span>
        </Row>

        {/* Search */}
        <motion.div style={{ width: searchWidth, position: "relative" }}>
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
              boxShadow: isSearchFocused ? "0 0 0 4px rgba(0, 122, 255, 0.1)" : "none",
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
        </motion.div>
      </Row>

      {/* Focus Mask */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="focus-mask active"
            style={{ position: "fixed", inset: 0, zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      <Row style={{ gap: "8px", alignItems: "center" }}>
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <IconButton
            icon={<Bell size={20} color={isNotifOpen ? "#FBBF24" : "#8E8E93"} />}
            variant="tertiary"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{ borderRadius: "10px" }}
          />
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

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{
                  position: "absolute",
                  top: "48px",
                  right: 0,
                  zIndex: 100,
                  width: "420px",
                  backgroundColor: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid #E5E5EA",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
                }}
              >
                {/* Notification Content (Simplified for now) */}
                <Column style={{ padding: "20px" }}>
                  <Heading variant="heading-strong-s">Notifications</Heading>
                  <Text style={{ color: "#8E8E93", fontSize: "0.8rem", marginTop: "12px" }}>
                    No new notifications
                  </Text>
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

        {/* Profile */}
        <div ref={profileMenuRef} style={{ position: "relative" }}>
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: profileGap,
              marginLeft: '12px',
              cursor: 'pointer',
            }}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <Avatar
              src={MOCK_USER.avatar}
              size="m"
            />
            <motion.div
              style={{
                opacity: profileTextOpacity,
                width: profileTextWidth,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                whiteSpace: "nowrap",
              }}
            >
              <Text style={{ color: "#1C1C1E", fontWeight: 600, fontSize: "0.85rem" }}>
                {MOCK_USER.name}
              </Text>
              <Text style={{ color: "#AEAEB2", fontSize: "0.7rem" }}>Level {MOCK_USER.level}</Text>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                style={{
                  position: "absolute",
                  top: "56px",
                  right: 0,
                  zIndex: 999,
                  width: "280px",
                  backgroundColor: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid #E5E5EA",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
                  padding: "6px",
                }}
              >
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
                        onSettingsClick();
                    }}
                  />
                  <ProfileMenuItem
                    icon={<Info size={16} />}
                    label="Thông tin & Trợ giúp"
                    onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleComingSoon();
                    }}
                  />
                </Column>
                <div style={{ height: "1px", backgroundColor: "#F2F2F7", margin: "4px 10px" }} />
                <ProfileMenuItem
                  icon={<LogOut size={16} color="#ED1B24" />}
                  label="Đăng xuất"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    toast("Đã đăng xuất! 👋");
                  }}
                  style={{ color: "#ED1B24" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Row>
    </motion.div>
  );
};
