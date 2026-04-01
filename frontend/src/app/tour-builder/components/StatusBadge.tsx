"use client";

import React from 'react';
import { Row, Text } from '@/components/OnceUI';
import { accent, text, radius, spacing } from '../tokens';

type StatusType = 'match' | 'distance' | 'time' | 'price' | 'rating';

interface StatusBadgeProps {
  type: StatusType;
  value: string | number;
  icon?: React.ReactNode;
}

const statusStyles: Record<StatusType, { color: string; bg: string }> = {
  match: { color: accent.warning, bg: accent.warningMuted },
  distance: { color: text.secondary, bg: 'rgba(255,255,255,0.06)' },
  time: { color: accent.secondary, bg: accent.secondaryMuted },
  price: { color: accent.primary, bg: accent.primaryMuted },
  rating: { color: accent.warning, bg: accent.warningMuted },
};

export function StatusBadge({ type, value, icon }: StatusBadgeProps) {
  const style = statusStyles[type];

  return (
    <Row
      style={{
        alignItems: 'center',
        gap: spacing['2xs'],
        padding: `${spacing['2xs']}px ${spacing.xs}px`,
        backgroundColor: style.bg,
        borderRadius: radius.s,
        border: `1px solid ${style.color}20`,
      }}
    >
      {icon}
      <Text
        style={{
          color: style.color,
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {value}
      </Text>
    </Row>
  );
}
