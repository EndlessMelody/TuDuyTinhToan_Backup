"use client";

import React from "react";
import { Column, Heading } from "@/components/OnceUI";
import { CardStack } from "./CardStack";
import { ActionControls } from "./ActionControls";
import { LocationData } from "./SwipeCard";

const MOCK_LOCATIONS: LocationData[] = [
  {
    id: "loc-1",
    title: "Hidden Waterfall",
    description: "A serene, undiscovered waterfall tucked away in the mountains.",
    imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  },
  {
    id: "loc-2",
    title: "Mountain Peak Cafe",
    description: "Sip espresso at 3,000 meters with panoramic views.",
    imageUrl: "https://images.unsplash.com/photo-1549880338-65dd215b2e31",
  },
  {
    id: "loc-3",
    title: "Neon Night Market",
    description: "Bustling street food stalls under bright neon lights.",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b44b829",
  },
];

export const DiscoveryView: React.FC = () => {
  const handleSwipeRight = (id: string) => {
    // Will be integrated with POST /api/users/{userId}/swipe
    console.log(`User liked location: ${id}`);
  };

  const handleSwipeLeft = (id: string) => {
    // Will be integrated with POST /api/users/{userId}/swipe
    console.log(`User passed location: ${id}`);
  };

  return (
    <Column align="center" justify="center" fillHeight fillWidth background="page">
      <Heading variant="display-default-xs" padding="16">
        Smart Travel App
      </Heading>
      
      <Column align="center" justify="center" gap="16" style={{ width: "100%", maxWidth: "400px", flex: 1 }}>
        <CardStack 
          items={MOCK_LOCATIONS} 
          onSwipeRight={handleSwipeRight} 
          onSwipeLeft={handleSwipeLeft} 
        />
        
        <ActionControls 
          onPass={() => console.log("Pass Button Clicked (API sync pending)")} 
          onLike={() => console.log("Like Button Clicked (API sync pending)")} 
        />
      </Column>
    </Column>
  );
};
