"use client";

import React from "react";
import { Row, Text } from "@/components/OnceUI";
import { Cpu, Globe, Users, Cloud, Clock } from "lucide-react";

/**
 * AppStatusBar - A fixed, center-aligned status bar for the Super App dashboard.
 * Positioned fixedly at the bottom of the center panel.
 */
export const AppStatusBar = () => {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        second: "2-digit",
        hour12: false 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Row
      fillWidth
      horizontal="center"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "32px",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        zIndex: 1000,
        padding: "0 24px",
      }}
    >
      <Row
        fillWidth
        horizontal="between"
        vertical="center"
        style={{ maxWidth: "1440px" }}
      >
        {/* Left: System Status */}
        <Row gap="16" vertical="center">
          <Row gap="6" vertical="center">
            <Cpu size={12} className="text-[#007AFF]" />
            <Text variant="body-default-xs" style={{ color: "#1C1C1E", fontWeight: 600 }}>
              ĐKhoa hong bic lam UI
            </Text>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34C759" }} />
          </Row>
          <Row gap="6" vertical="center" hide="s">
            <Cloud size={12} style={{ color: "#8E8E93" }} />
            <Text variant="body-default-xs" style={{ color: "#8E8E93" }}>
              Syncing
            </Text>
          </Row>
        </Row>

        {/* Center: Quick Nav Pill */}
        <Row
          gap="20"
          vertical="center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            padding: "2px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(0, 0, 0, 0.03)",
          }}
        >
          {["Discovery", "Vault", "Map"].map((item) => (
            <Text
              key={item}
              variant="body-default-xs"
              style={{
                color: "#1C1C1E",
                fontWeight: 500,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e: any) => (e.target.style.opacity = "0.6")}
              onMouseLeave={(e: any) => (e.target.style.opacity = "1")}
            >
              {item}
            </Text>
          ))}
        </Row>

        {/* Right: Metrics */}
        <Row gap="16" vertical="center">
          <Row gap="6" vertical="center" hide="m">
            <Users size={12} style={{ color: "#8E8E93" }} />
            <Text variant="body-default-xs" style={{ color: "#8E8E93" }}>
              342 Lobbies
            </Text>
          </Row>
          <Row gap="6" vertical="center">
            <Clock size={12} style={{ color: "#8E8E93" }} />
            <Text variant="body-default-xs" style={{ color: "#8E8E93", fontVariantNumeric: "tabular-nums" }}>
              {time}
            </Text>
          </Row>
          <Row gap="6" vertical="center">
            <Globe size={12} style={{ color: "#007AFF" }} />
            <Text variant="body-default-xs" style={{ color: "#1C1C1E", fontWeight: 600 }}>
              Dĩ An
            </Text>
          </Row>
        </Row>
      </Row>
    </Row>
  );
};
