import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Column,
  Row,
  Heading,
  Text,
  IconButton,
  Button,
} from "@/components/OnceUI";
import {
  X,
  Palette,
  Globe,
  BellRing,
  LifeBuoy,
  Info,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = "appearance",
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState(initialTab);

  const handleComingSoon = () => {
    // This would typically be a toast, but since we're decoupling, 
    // we could pass a toast handler or just leave it for now.
    alert("Will be updated in the next version 🚀");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
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
                <Heading variant="heading-strong-s" style={{ color: "#1C1C1E" }}>
                  Cài đặt
                </Heading>
                <IconButton
                  icon={<X size={16} color="#AEAEB2" />}
                  onClick={onClose}
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
                { id: "appearance", label: "Giao diện", icon: <Palette size={16} /> },
                { id: "language", label: "Ngôn ngữ", icon: <Globe size={16} /> },
                { id: "notifications", label: "Thông báo", icon: <BellRing size={16} /> },
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
                    backgroundColor: activeSettingsTab === tab.id ? "rgba(0,122,255,0.08)" : "transparent",
                    color: activeSettingsTab === tab.id ? "#007AFF" : "#8E8E93",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", color: "inherit" }}>{tab.icon}</div>
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

              <div style={{ height: "1px", backgroundColor: "#F2F2F7", margin: "8px 0" }} />

              {[
                { id: "support", label: "Trợ giúp", icon: <LifeBuoy size={16} /> },
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
                    backgroundColor: activeSettingsTab === tab.id ? "rgba(0,122,255,0.08)" : "transparent",
                    color: activeSettingsTab === tab.id ? "#007AFF" : "#8E8E93",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", color: "inherit" }}>{tab.icon}</div>
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

              <div style={{ flex: 1 }} />
              <Text style={{ color: "#D1D1D6", fontSize: "0.65rem", padding: "0 8px" }}>
                TasteMap v1.0.0-beta
              </Text>
            </Column>

            {/* Right Content Area */}
            <Column style={{ flex: 1, padding: "32px 40px", overflowY: "auto", gap: "24px" }}>
              {activeSettingsTab === "appearance" && (
                <>
                  <Column style={{ gap: "4px" }}>
                    <Heading variant="heading-strong-m" style={{ color: "#1C1C1E" }}>
                      Giao diện (Appearance)
                    </Heading>
                    <Text style={{ color: "#AEAEB2", fontSize: "0.8rem" }}>
                      Chọn theme hiển thị cho ứng dụng
                    </Text>
                  </Column>
                  <Row style={{ gap: "16px" }}>
                    {[
                      { id: "light", label: "Sáng", icon: <Sun size={24} />, active: true },
                      { id: "dark", label: "Tối", icon: <Moon size={24} />, active: false },
                      { id: "system", label: "Hệ thống", icon: <Monitor size={24} />, active: false },
                    ].map((theme) => (
                      <Column
                        key={theme.id}
                        onClick={handleComingSoon}
                        style={{
                          flex: 1,
                          padding: "24px 16px",
                          alignItems: "center",
                          gap: "12px",
                          backgroundColor: theme.active ? "rgba(0,122,255,0.05)" : "white",
                          border: theme.active ? "2px solid #007AFF" : "1px solid #E5E5EA",
                          borderRadius: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ color: theme.active ? "#007AFF" : "#8E8E93" }}>{theme.icon}</div>
                        <Text
                          style={{
                            color: theme.active ? "#007AFF" : "#8E8E93",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {theme.label}
                        </Text>
                      </Column>
                    ))}
                  </Row>

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
                      {["#ED1B24", "#007AFF", "#A855F7", "#FBBF24", "#34C759", "#F97316"].map((c) => (
                        <div
                          key={c}
                          onClick={handleComingSoon}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: c,
                            border: c === "#ED1B24" ? "3px solid white" : "2px solid transparent",
                            cursor: "pointer",
                            transition: "transform 0.15s",
                            boxShadow: c === "#ED1B24" ? `0 0 12px ${c}60` : "none",
                          }}
                        />
                      ))}
                    </Row>
                  </Column>
                </>
              )}

              {activeSettingsTab === "language" && (
                <>
                  <Column style={{ gap: "4px" }}>
                    <Heading variant="heading-strong-m" style={{ color: "#1C1C1E" }}>
                      Ngôn ngữ (Language)
                    </Heading>
                    <Text style={{ color: "#AEAEB2", fontSize: "0.8rem" }}>
                      Chọn ngôn ngữ hiển thị
                    </Text>
                  </Column>
                  <Column style={{ gap: "8px" }}>
                    {[
                      { code: "vi", label: "Tiếng Việt", flag: "🇻🇳", active: true },
                      { code: "en", label: "English", flag: "🇺🇸", active: false },
                      { code: "ja", label: "日本語", flag: "🇯🇵", active: false },
                      { code: "ko", label: "한국어", flag: "🇰🇷", active: false },
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
                          backgroundColor: lang.active ? "rgba(0,122,255,0.05)" : "white",
                          border: lang.active ? "1px solid #007AFF" : "1px solid #E5E5EA",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{lang.flag}</span>
                        <Text
                          style={{
                            color: lang.active ? "#1C1C1E" : "#8E8E93",
                            fontWeight: lang.active ? 600 : 400,
                            fontSize: "0.9rem",
                            flex: 1,
                          }}
                        >
                          {lang.label}
                        </Text>
                        {lang.active && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#007AFF" }} />}
                      </Row>
                    ))}
                  </Column>
                </>
              )}

              {activeSettingsTab === "support" && (
                <Column style={{ gap: "24px" }}>
                   <Heading variant="heading-strong-m" style={{ color: "#1C1C1E" }}>
                      Trợ giúp & Hỗ trợ
                    </Heading>
                    <Text style={{ color: "#8E8E93", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      Bạn cần hỗ trợ? Đội ngũ TasteMap luôn sẵn sàng giúp đỡ bạn 24/7.
                    </Text>
                    <Button variant="primary" style={{ borderRadius: "12px" }}>Liên hệ hỗ trợ</Button>
                </Column>
              )}
            </Column>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
