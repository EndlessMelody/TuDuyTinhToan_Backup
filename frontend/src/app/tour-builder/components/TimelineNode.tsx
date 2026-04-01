"use client";

import React from 'react';
import { Text } from '@/components/OnceUI';
import { motion } from 'framer-motion';
import { surface, accent, text, border, radius, shadow, motion as motionTokens } from '../tokens';

interface TimelineNodeProps {
  index: number;
  imageUrl?: string;
  color?: string;
  isActive?: boolean;
  isFilled?: boolean;
}

export function TimelineNode({
  index,
  imageUrl,
  color,
  isActive = false,
  isFilled = false,
}: TimelineNodeProps) {
  const nodeSize = 64;

  const getStyles = () => {
    if (isFilled && color) {
      return {
        border: `3px solid ${color}`,
        backgroundColor: 'transparent',
        boxShadow: shadow.glow(`${color}60`),
      };
    }
    if (isActive) {
      return {
        border: `2px solid ${accent.primary}80`,
        backgroundColor: accent.primaryMuted,
        boxShadow: undefined,
      };
    }
    return {
      border: `2px dashed ${border.medium}`,
      backgroundColor: surface.base,
      boxShadow: undefined,
    };
  };

  const styles = getStyles();

  return (
    <motion.div
      animate={
        isActive && !isFilled
          ? {
              boxShadow: [
                '0 0 8px rgba(0,209,178,0.2)',
                '0 0 20px rgba(0,209,178,0.5)',
                '0 0 8px rgba(0,209,178,0.2)',
              ],
            }
          : {}
      }
      transition={
        isActive && !isFilled
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : motionTokens.easeOut
      }
      style={{
        width: nodeSize,
        height: nodeSize,
        borderRadius: radius.full,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.4s, background-color 0.4s',
        ...styles,
      }}
    >
      {imageUrl ? (
        <motion.img
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={motionTokens.spring}
          src={imageUrl}
          alt={`Stop ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Text
          style={{
            color: isActive ? accent.primary : text.disabled,
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {index + 1}
        </Text>
      )}
    </motion.div>
  );
}

// Connector line between nodes
export function TimelineConnector({ isActive = false }: { isActive?: boolean }) {
  return (
    <div
      style={{
        width: 40,
        height: 2,
        background: isActive
          ? `linear-gradient(90deg, ${accent.primary}, ${accent.primary}80)`
          : border.weak,
        borderStyle: isActive ? 'solid' : 'dashed',
        transition: 'all 0.4s ease',
      }}
    />
  );
}
