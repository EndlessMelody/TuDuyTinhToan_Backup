"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Archive, Heart } from "lucide-react";
import type { VaultItem } from "@/hooks/useGroupSwipe";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";

interface GroupVaultSheetProps {
  open: boolean;
  onClose: () => void;
  vault: VaultItem[];
  loading: boolean;
}

export function GroupVaultSheet({
  open,
  onClose,
  vault,
  loading,
}: GroupVaultSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "70vh",
              backgroundColor: "#fff",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              zIndex: 51,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Handle + Header */}
            <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
              {/* Drag handle */}
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#D1D1D6",
                  margin: "0 auto 12px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                  borderBottom: "1px solid #F2F2F7",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.06))",
                    }}
                  >
                    <Archive size={16} style={{ color: "#6366F1" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#1C1C1E",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Group Vault
                    </h3>
                    <p style={{ fontSize: 11, color: "#8E8E93" }}>
                      {vault.length} place{vault.length !== 1 ? "s" : ""} saved
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "#F2F2F7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8E8E93",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="no-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 20px 24px",
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      border: "3px solid rgba(99,102,241,0.2)",
                      borderTopColor: "#6366F1",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : vault.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#AEAEB2",
                  }}
                >
                  <Archive
                    size={36}
                    style={{ color: "#D1D1D6", marginBottom: 12 }}
                  />
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#3C3C43",
                      marginBottom: 4,
                    }}
                  >
                    Vault is empty
                  </p>
                  <p style={{ fontSize: 12 }}>
                    Places you and your group like will appear here.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {vault.map((item, idx) => (
                    <motion.div
                      key={item.location_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 10,
                        borderRadius: 14,
                        backgroundColor: "#FAFAFA",
                        border: "1px solid #F2F2F7",
                      }}
                    >
                      <img
                        src={item.image_url || FALLBACK_IMG}
                        alt={item.name}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 10,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1C1C1E",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 2,
                          }}
                        >
                          <Heart
                            size={10}
                            style={{ color: "#FF3B30" }}
                            fill="#FF3B30"
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: "#8E8E93",
                              fontWeight: 600,
                            }}
                          >
                            {item.votes} vote{item.votes !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Vote count badge */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(52,199,89,0.12)",
                          color: "#1FAD45",
                          fontSize: 13,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {item.votes}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
