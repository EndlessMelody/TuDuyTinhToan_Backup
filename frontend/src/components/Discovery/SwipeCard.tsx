"use client";

import React, { useState } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Column, Row, Heading, Text } from "@/components/OnceUI"; // Note: Adjust import to match your Once UI alias

export interface LocationData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface SwipeCardProps {
  data: LocationData;
  active: boolean;
  onSwipeRight: (id: string) => void;
  onSwipeLeft: (id: string) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  data,
  active,
  onSwipeRight,
  onSwipeLeft,
}) => {
  const controls = useAnimation();
  const [exitX, setExitX] = useState<number>(0);

  const dragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      setExitX(300);
      onSwipeRight(data.id);
    } else if (info.offset.x < -swipeThreshold) {
      setExitX(-300);
      onSwipeLeft(data.id);
    } else {
      // Snap back to center if threshold is not reached
      controls.start({ x: 0, rotate: 0 });
    }
  };

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={dragEnd}
      animate={controls}
      initial={{ scale: 0.95, opacity: 0 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: "400px", // Setting a max width for mobile feel
        height: "600px",   // Typical card aspect ratio
        borderRadius: "24px",
        overflow: "hidden",
        backgroundImage: `url(${data.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        cursor: active ? "grab" : "auto",
        zIndex: active ? 10 : 0,
      }}
    >
      <Column
        fillWidth
        fillHeight
        justify="end"
        padding="min(32px, 2rem)"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
        }}
      >
        <Row fillWidth>
          <Column gap="8">
            <Heading variant="display-strong-xs" style={{ color: "white" }}>
              {data.title}
            </Heading>
            <Text variant="body-default-m" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              {data.description}
            </Text>
          </Column>
        </Row>
      </Column>
    </motion.div>
  );
};
