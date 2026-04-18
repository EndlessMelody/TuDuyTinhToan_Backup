import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, Utensils } from "lucide-react";

import { PRICE_ICONS } from "../data";
import type { Spot } from "../types";
import { CATEGORY_ICON } from "../ui-constants";

interface SpotCardProps {
  spot: Spot;
  selected: boolean;
  onClick: () => void;
}

export default function SpotCard({ spot, selected, onClick }: SpotCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left flex gap-3 p-2.5 rounded-[18px] cursor-pointer transition-all"
      style={{
        background: selected
          ? `linear-gradient(145deg, ${spot.accent}20 0%, rgba(255,255,255,0.96) 100%)`
          : "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(255,246,235,0.96) 100%)",
        border: selected
          ? `1.5px solid ${spot.accent}5f`
          : "1.5px solid rgba(189,127,87,0.2)",
        boxShadow: selected
          ? `0 14px 24px ${spot.accent}2b`
          : "0 8px 18px rgba(139, 82, 48, 0.09)",
      }}
    >
      <div className="w-21 h-21 rounded-[13px] overflow-hidden shrink-0 relative">
        <Image
          src={spot.img}
          alt={spot.name}
          fill
          unoptimized
          sizes="84px"
          className="object-cover"
        />
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            height: 28,
            background:
              "linear-gradient(180deg, rgba(16,10,7,0) 0%, rgba(16,10,7,0.52) 100%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            borderRadius: 999,
            padding: "2px 7px",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#fff",
            backgroundColor: "rgba(20,16,13,0.56)",
            backdropFilter: "blur(5px)",
          }}
        >
          {spot.emoji}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[14px] font-extrabold text-[#29160d] leading-tight">
            {spot.name}
          </h4>
          <span
            className="text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-full"
            style={{
              color: spot.isOpen ? "#137b42" : "#b33628",
              backgroundColor: spot.isOpen
                ? "rgba(22,163,74,0.14)"
                : "rgba(220,38,38,0.13)",
              border: spot.isOpen
                ? "1px solid rgba(22,163,74,0.24)"
                : "1px solid rgba(220,38,38,0.24)",
            }}
          >
            {spot.isOpen ? `Until ${spot.closesAt}` : "Closed"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span style={{ color: spot.accent }}>
            {CATEGORY_ICON[spot.category] ?? <Utensils size={12} />}
          </span>
          <span className="text-[12px] text-[#7b5946] font-semibold">{spot.category}</span>
          <span className="text-[#cfb9a9]">·</span>
          <span className="text-[12px] text-[#8f6c57] font-semibold">
            {PRICE_ICONS[spot.priceLevel]}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[12px] text-[#ca7a18] font-bold">
            <Star size={11} fill="currentColor" /> {spot.rating}
            <span className="text-[#aa8d7a] font-medium">({spot.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#8c6d59] font-semibold">
            <MapPin size={11} /> {spot.distance}
          </span>
        </div>

        <div className="flex gap-1.5 mt-2 flex-wrap">
          {spot.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${spot.accent}1a`,
                color: spot.accent,
                border: `1px solid ${spot.accent}33`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
