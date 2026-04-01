"use client";

import React from 'react';
import { Row, Text } from '@/components/OnceUI';
import { text, radius, spacing, border } from '../tokens';

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
}

export function StatPill({ icon, label, color }: StatPillProps) {
  return (
    <Row
      style={{
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs}px ${spacing.m}px`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: radius.m,
        border: `1px solid ${border.weak}`,
      }}
    >
      {icon}
      <Text
        style={{
          color: color ?? text.secondary,
          fontSize: '0.85rem',
          fontWeight: 500,
        }}
      >
        {label}
      </Text>
    </Row>
  );
}
