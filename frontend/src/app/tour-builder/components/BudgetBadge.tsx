"use client";

import React from "react";
import { Row, Text } from "@/components/OnceUI";
import { DollarSign } from "lucide-react";
import { accent, radius, spacing } from "../tokens";

interface BudgetBadgeProps {
  price: string;
  size?: "s" | "m";
}

export function BudgetBadge({ price, size = "m" }: BudgetBadgeProps) {
  const isSmall = size === "s";

  return (
    <Row
      style={{
        alignItems: "center",
        gap: spacing["2xs"],
        padding: isSmall
          ? `${spacing["2xs"]}px ${spacing.xs}px`
          : `${spacing.xs}px ${spacing.s}px`,
        backgroundColor: accent.primaryMuted,
        borderRadius: radius.s,
        border: `1px solid ${accent.primary}25`,
      }}
    >
      <DollarSign size={isSmall ? 12 : 14} color={accent.primary} />
      <Text
        style={{
          color: accent.primary,
          fontSize: isSmall ? "0.7rem" : "0.8rem",
          fontWeight: 600,
        }}
      >
        ~{price} VND
      </Text>
    </Row>
  );
}
