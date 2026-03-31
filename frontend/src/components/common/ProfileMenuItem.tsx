"use client";

import React from "react";
import { Row, Text } from "../OnceUI";

export function ProfileMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Row
      onClick={onClick}
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
        (e.currentTarget.style.backgroundColor = "#F2F2F7")
      }
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <div
        style={{
          color: "#8E8E93",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <Text
        style={{
          color: "#1C1C1E",
          fontWeight: 500,
          fontSize: "0.85rem",
        }}
      >
        {label}
      </Text>
    </Row>
  );
}
