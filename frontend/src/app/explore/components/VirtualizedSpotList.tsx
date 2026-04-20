"use client";

import React, { useCallback, useRef } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { InfiniteLoader } from "react-window-infinite-loader";
import { motion } from "framer-motion";
import type { Spot } from "../types";
import SpotCard from "./SpotCard";

interface VirtualizedSpotListProps {
  spots: Spot[];
  selected: Spot | null;
  onSelect: (spot: Spot) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

const ITEM_HEIGHT = 100; // Height of each SpotCard in pixels
const BUFFER_ITEMS = 5;

// Individual row renderer
const Row = React.memo(function Row({
  index,
  style,
  data,
}: ListChildComponentProps<{
  spots: Spot[];
  selected: Spot | null;
  onSelect: (spot: Spot) => void;
}>) {
  const { spots, selected, onSelect } = data;
  const spot = spots[index];

  if (!spot) return null;

  return (
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          delay: (index % 10) * 0.02,
        }}
      >
        <SpotCard
          spot={spot}
          selected={selected?.id === spot.id}
          onClick={() => onSelect(spot)}
        />
      </motion.div>
    </div>
  );
});

export default function VirtualizedSpotList({
  spots,
  selected,
  onSelect,
  hasMore,
  onLoadMore,
  isLoading,
}: VirtualizedSpotListProps) {
  const listRef = useRef<List>(null);

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index: number) => !hasMore || index < spots.length,
    [hasMore, spots.length],
  );

  // Load more items
  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  // Item count (add 1 if hasMore for loading indicator)
  const itemCount = hasMore ? spots.length + 1 : spots.length;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={BUFFER_ITEMS}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={600} // Container height - adjust as needed
          itemCount={spots.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
          onItemsRendered={onItemsRendered}
          ref={(list) => {
            // Combine refs
            (ref as React.MutableRefObject<List | null>).current = list;
            (listRef as React.MutableRefObject<List | null>).current = list;
          }}
          itemData={{
            spots,
            selected,
            onSelect,
          }}
          overscanCount={BUFFER_ITEMS}
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
}
