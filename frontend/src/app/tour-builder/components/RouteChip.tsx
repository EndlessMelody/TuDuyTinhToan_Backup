"use client";

import React from 'react';
import { Text } from '@/components/OnceUI';
import { radius, spacing } from '../tokens';

interface RouteChipProps {
  label: string;
  color: string;
}

export function RouteChip({ label, color }: RouteChipProps) {
  return (
    <Text
      style={{
        display: 'inline-block',
        padding: `${spacing['2xs']}px ${spacing.s}px`,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: radius.s,
        fontSize: '0.7rem',
        fontWeight: 600,
        color: color,
      }}
    >
      {label}
    </Text>
  );
}
