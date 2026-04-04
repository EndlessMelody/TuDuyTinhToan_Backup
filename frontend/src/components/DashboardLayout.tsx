"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  IconButton,
  Avatar,
} from "@/components/OnceUI";
import {
  Compass,
  Hand,
  MapPin,
  Users,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AppStatusBar } from "./common/AppStatusBar";
import { useAuth } from "@/hooks/useAuth";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import ClientOnly from "./common/ClientOnly";
import { UserVectorProvider, useUserVector } from "@/context/UserVectorContext";

function SidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const showHighlight = active || isHovered;

  return (
    <Row
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="focus-ring"
      tabIndex={0}
      style={{
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: collapsed ? "0px" : "12px",
        paddingRight: collapsed ? "0px" : "12px",
        borderRadius: "10px",
        backgroundColor: showHighlight ? "#EAF2FF" : "transparent",
        cursor: "pointer",
        borderTopWidth: "0px",
        borderBottomWidth: "0px",
        borderRightWidth: "0px",
        borderLeftWidth: "3px",
        borderLeftStyle: "solid",
        borderLeftColor: active ? "#007AFF" : "transparent",
        color: showHighlight ? "#007AFF" : "#8E8E93",
        transitionProperty: "all",
        transitionDuration: "0.2s",
        transitionTimingFunction: "ease",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? "0px" : "14px",
        overflow: "hidden",
        minHeight: "42px",
      }}
    >
      <div
        style={{
          color: "inherit",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      {!collapsed && (
        <Text
          style={{
            color: "inherit",
            fontWeight: active ? 600 : isHovered ? 500 : 400,
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Text>
      )}
    </Row>
  );
}

const handleComingSoon = () => toast("Will be updated in the next version 🚀");

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserVectorProvider>
        <ChatProvider>
          <LayoutContent>{children}</LayoutContent>
        </ChatProvider>
      </UserVectorProvider>
    </AuthProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { radarData, mergedRadarData, isPulsing } = useUserVector();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightExpanded, setIsRightExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isProfilePage = pathname === "/profile" || pathname.startsWith("/admin");
  const isFullScreenPage = pathname.startsWith("/profile") ||
    pathname.startsWith("/tour-builder");

  // Auto-collapse sidebars when entering fullscreen pages
  React.useEffect(() => {
    if (isFullScreenPage) {
      setIsSidebarOpen(false);
      setIsRightExpanded(false);
    } else {
      setIsSidebarOpen(true);
      setIsRightExpanded(false);
    }
  }, [isFullScreenPage]);

  const { isChatOpen, setIsChatOpen, activeFriend } = useChat();

  // Promo page: render full-screen, no chrome
  if (isPromoPage) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  const sidebarWidth = isFullScreenPage ? 0 : isSidebarOpen ? 240 : 80;
  const isFoodies = pathname.startsWith("/foodies");

  const rightExpandedWidth = isFoodies ? "100%" : "320px";
  const rightSidebarWidth = isFullScreenPage
    ? "0px"
    : isFoodies
      ? isChatOpen
        ? "flex-fill"
        : "0px"
      : isRightExpanded
        ? "320px"
        : "80px";

  return (
    <Row
      fillWidth
      background={isFullScreenPage ? "surface" : "page"}
      overflow="hidden"
      style={{ height: "100vh", color: "#1C1C1E" }}
    >
      {/* ═══════════ 1. LEFT SIDEBAR ═══════════ */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isFullScreen={isFullScreenPage}
        currentPath={pathname}
        onComingSoon={handleComingSoon}
      />

      {/* 2. CENTER PANEL (CHATS LIST) */}
      <Column
        fillHeight
        horizontal={isFoodies && isChatOpen ? "start" : "center"}
        vertical="stretch"
        gap="0"
        flexGrow={isFoodies && isChatOpen ? 0 : 1}
        flexShrink={isFoodies && isChatOpen ? 0 : 1}
        flexBasis={isFoodies && isChatOpen ? "320px" : "0%"}
        style={{
          minWidth: 0,
          position: "relative",
          backgroundColor: isFoodies && isChatOpen ? "white" : "transparent",
        }}
      >
        {/* Logo + Toggle */}
        <Row
          fillWidth
          style={{
            justifyContent: isSidebarOpen ? "space-between" : "center",
            alignItems: "center",
            minHeight: "36px",
          }}
        >
          {isSidebarOpen && (
            <Heading
              variant="heading-strong-l"
              style={{
                color: "#ED1B24",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
              }}
            >
              TasteMap.
            </Heading>
          )}
          <IconButton
            icon={
              isSidebarOpen ? (
                <PanelLeftClose size={18} color="#48484A" />
              ) : (
                <PanelLeftOpen size={18} color="#48484A" />
              )
            }
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              backgroundColor: "#F2F2F7",
              borderRadius: "10px",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderRightWidth: "1px",
              borderTopStyle: "solid",
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
              borderRightStyle: "solid",
              borderTopColor: "#E5E5EA",
              borderBottomColor: "#E5E5EA",
              borderLeftColor: "#E5E5EA",
              borderRightColor: "#E5E5EA",
              transitionProperty: "background-color",
              transitionDuration: "0.2s",
            }}
          />
        </Row>

        {/* Menu Section */}
        <Column style={{ gap: "4px", width: "100%" }}>
          {isSidebarOpen && (
            <Text
              variant="body-default-xs"
              style={{
                color: "#AEAEB2",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "8px",
                paddingLeft: "12px",
              }}
            >
              Menu
            </Text>
          )}
          <SidebarItem
            icon={<Compass size={20} />}
            label="Discover"
            active
            collapsed={!isSidebarOpen}
            onClick={() => { }}
          />
          <SidebarItem
            icon={<Hand size={20} />}
            label="Food Tour Builder"
            collapsed={!isSidebarOpen}
            onClick={() => router.push("/tour-builder")}
          />
          <SidebarItem
            icon={<MapPin size={20} />}
            label="Local Hot Routes"
            collapsed={!isSidebarOpen}
            onClick={handleComingSoon}
          />
        </Column>

        {/* Social Section */}
        <Column style={{ gap: "4px", width: "100%" }}>
          {isSidebarOpen && (
            <Text
              variant="body-default-xs"
              style={{
                color: "#AEAEB2",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "8px",
                paddingLeft: "12px",
              }}
            >
              Social
            </Text>
          )}
          <SidebarItem
            icon={<Users size={20} />}
            label="Foodies"
            collapsed={!isSidebarOpen}
            onClick={handleComingSoon}
          />
          <SidebarItem
            icon={<Mic size={20} />}
            label="Group Rooms"
            collapsed={!isSidebarOpen}
            onClick={handleComingSoon}
          />
        </Column>

        {/* Spacer */}
        <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: "0%" }} />

        {/* Gamification Card */}
        {isSidebarOpen ? (
          <Column
            style={{
              backgroundColor: "#F2F2F7",
              borderRadius: "16px",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderRightWidth: "1px",
              borderTopStyle: "solid",
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
              borderRightStyle: "solid",
              borderTopColor: "#E5E5EA",
              borderBottomColor: "#E5E5EA",
              borderLeftColor: "#E5E5EA",
              borderRightColor: "#E5E5EA",
              paddingTop: "16px",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              gap: "12px",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Row style={{ alignItems: "center", gap: "12px" }}>
              <Avatar
                src={user?.avatar_url || ""}
                size="m"
              />
              <Column>
                <Heading variant="heading-strong-s" style={{ color: "#1C1C1E" }}>
                  {user?.display_name || user?.username || "Explorer"}
                </Heading>
                <Text
                  variant="body-default-xs"
                  style={{ color: "#8E8E93" }}
                >
                  Level {user?.level || 1} • Vector Map
                </Text>
              </Column>
            </Row>
            <div
              style={{
                width: "100%",
                height: "150px",
                marginTop: "-4px",
                marginBottom: "-4px",
                minWidth: 100,
                minHeight: 100,
                transform: isPulsing ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <ClientOnly>
                <ResponsiveContainer width="100%" height={150} minWidth={100} debounce={50}>
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={mergedRadarData}>
                    <PolarGrid stroke="#E5E5EA" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#8E8E93", fontSize: 10 }}
                    />
                    {/* Shadow Radar (Previous state) */}
                    <Radar
                      name="Previous Taste"
                      dataKey="prevA"
                      stroke="#AEAEB2"
                      fill="#AEAEB2"
                      fillOpacity={0.1}
                      isAnimationActive={false}
                    />
                    <Radar
                      name="Taste"
                      dataKey="A"
                      stroke="#007AFF"
                      fill="#007AFF"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
            <Button
              size="s"
              variant="secondary"
              fillWidth
              onClick={handleComingSoon}
            >
              Challenge Data
            </Button>
          </Column>
        ) : (
          <Column
            style={{
              alignItems: "center",
              width: "100%",
              paddingBottom: "8px",
            }}
          >
            <Avatar
              src={user?.avatar_url || ""}
              size="m"
              style={{
                borderTopWidth: "2px",
                borderBottomWidth: "2px",
                borderLeftWidth: "2px",
                borderRightWidth: "2px",
                borderTopStyle: "solid",
                borderBottomStyle: "solid",
                borderLeftStyle: "solid",
                borderRightStyle: "solid",
                borderTopColor: "#007AFF",
                borderBottomColor: "#007AFF",
                borderLeftColor: "#007AFF",
                borderRightColor: "#007AFF",
                cursor: "pointer"
              }}
            />
          </Column>
        )}
      </Column>

      {/* 2. CENTER PANEL (CHILDREN) */}
      <Column fillHeight horizontal="center" vertical="between" gap="0" style={{ flex: "1 1 0%", minWidth: 0, position: "relative", paddingBottom: "0", paddingTop: "0" }}>
        <Column
          key={pathname}
          fillWidth
          fillHeight
          vertical="stretch"
          gap="0"
          style={{
            maxWidth: isFullScreenPage ? "100%" : "1440px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "0",
            paddingTop: "0",
            overflow: "hidden",
            position: "relative",
            minHeight: "1px",
            transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {children}
        </Column>
        {!isFoodies && <AppStatusBar />}
      </Column>

      {/* 3. RIGHT SIDEBAR */}
      <Column
        onMouseEnter={() => !isFoodies && setIsRightExpanded(true)}
        onMouseLeave={() => !isFoodies && setIsRightExpanded(false)}
        fillHeight
        background="surface"
        borderLeft="neutral-alpha-weak"
        radius="none"
        style={{
          width: rightSidebarWidth === "flex-fill" ? "auto" : rightSidebarWidth,
          minWidth: rightSidebarWidth === "flex-fill" ? "0" : rightSidebarWidth,
          flexGrow: rightSidebarWidth === "flex-fill" ? 1 : 0,
          flexShrink: 0,
          flexBasis: rightSidebarWidth === "flex-fill" ? "0%" : "auto",
          paddingLeft: "0",
          paddingRight: "0",
          transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          overflow: "hidden",
          paddingTop: isFullScreenPage || isFoodies ? "0" : "24px",
          paddingBottom: isFullScreenPage || isFoodies ? "0" : "24px",
          borderLeftWidth:
            isFullScreenPage || (isFoodies && !isChatOpen) ? "0" : "1px",
          borderLeftStyle: "solid",
          borderLeftColor:
            isFullScreenPage || (isFoodies && !isChatOpen)
              ? "transparent"
              : "rgba(0,0,0,0.06)",
        }}
      >
        {isFoodies ? (
          <MessagingSidebar
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(!isChatOpen)}
            activeUser={activeFriend}
          />
        ) : (
          <Row
            style={{
              paddingTop: "0px",
              paddingBottom: "20px",
              paddingLeft: "18px",
              paddingRight: "18px",
              alignItems: "center",
              justifyContent: isRightExpanded ? "space-between" : "center",
              borderBottomWidth: "1px",
              borderBottomStyle: "solid",
              borderBottomColor: "#E5E5EA",
              gap: "12px",
              minHeight: "44px",
            }}
          >
            {isRightExpanded && (
              <Heading
                variant="heading-strong-s"
                style={{
                  color: "#1C1C1E",
                  whiteSpace: "nowrap",
                  opacity: isRightExpanded ? 1 : 0,
                  transition: "opacity 0.2s 0.1s",
                }}
              >
                Friends
              </Heading>
            )}
            <IconButton
              icon={<Plus size={20} color="#ED1B24" />}
              onClick={handleComingSoon}
              style={{
                backgroundColor: "transparent",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderLeftWidth: "1px",
                borderRightWidth: "1px",
                borderTopStyle: "solid",
                borderBottomStyle: "solid",
                borderLeftStyle: "solid",
                borderRightStyle: "solid",
                borderTopColor: "rgba(255,255,255,0.12)",
                borderBottomColor: "rgba(255,255,255,0.12)",
                borderLeftColor: "rgba(255,255,255,0.12)",
                borderRightColor: "rgba(255,255,255,0.12)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                minWidth: "44px",
                cursor: "pointer",
                transitionProperty: "border-color",
                transitionDuration: "0.2s",
                flexShrink: 0,
              }}
            />
          </Row>
        )}
      </Column>
    </Row>
  );
}
