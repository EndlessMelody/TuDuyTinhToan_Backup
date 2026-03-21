"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Column } from "@/components/OnceUI"; // Note: Adjust import based on the actual UI primitive library structure
import { SwipeCard, LocationData } from "./SwipeCard";

export interface CardStackProps {
  items: LocationData[];
  onSwipeRight: (id: string) => void;
  onSwipeLeft: (id: string) => void;
}

export const CardStack: React.FC<CardStackProps> = ({ items, onSwipeRight, onSwipeLeft }) => {
  const [cards, setCards] = useState<LocationData[]>(items);

  const handleSwipeRight = (id: string) => {
    onSwipeRight(id);
    // Remove the swiped card from the stack
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSwipeLeft = (id: string) => {
    onSwipeLeft(id);
    // Remove the swiped card from the stack
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Column
      fillWidth
      fillHeight
      position="relative"
      justify="center"
      align="center"
      // Using standard CSS perspective for a 3D effect foundation
      style={{ perspective: "1000px", overflow: "hidden" }}
    >
      <AnimatePresence>
        {cards.map((data, index) => {
          // The top card is at the first index logically, but we use map index
          const isTop = index === 0;
          return (
            <SwipeCard
              key={data.id}
              data={data}
              active={isTop}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
            />
          );
        }).reverse()} {/* Reverse to render earlier cards on top of the DOM stack visually */}
      </AnimatePresence>
    </Column>
  );
};
