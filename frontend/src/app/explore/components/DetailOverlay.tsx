import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Utensils, X, ChevronRight } from "lucide-react";

import { CATEGORY_ICON } from "../ui-constants";
import { PRICE_ICONS } from "../data";
import type { Spot } from "../types";

interface DetailOverlayProps {
  spot: Spot;
  onClose: () => void;
}

export default function DetailOverlay({ spot, onClose }: DetailOverlayProps) {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="absolute bottom-5 left-5 right-5 z-10 bg-white rounded-[24px] overflow-hidden"
      style={{
        boxShadow: "0 16px 48px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex gap-4 p-4">
        <div className="w-25 h-25 rounded-[16px] overflow-hidden shrink-0 relative">
          <Image
            src={spot.img}
            alt={spot.name}
            fill
            unoptimized
            sizes="100px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#1C1C1E] leading-tight">
                {spot.name}
              </h3>
              <p className="text-[13px] text-[#8E8E93] mt-0.5 flex items-center gap-1">
                {CATEGORY_ICON[spot.category] ?? <Utensils size={12} />} {spot.category} · {PRICE_ICONS[spot.priceLevel]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA] transition shrink-0"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-[13px] text-[#636366] mt-2 leading-relaxed line-clamp-2">
            {spot.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[13px] font-bold text-[#FBBF24]">
              <Star size={13} fill="currentColor" /> {spot.rating}
            </span>
            <span className="flex items-center gap-1 text-[13px] text-[#8E8E93]">
              <MapPin size={12} /> {spot.distance}
            </span>
            <span
              className="flex items-center gap-1 text-[13px]"
              style={{ color: spot.isOpen ? "#34C759" : "#FF3B30" }}
            >
              <Clock size={12} /> {spot.isOpen ? `Open · closes ${spot.closesAt}` : "Closed now"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: spot.accent + "15",
                color: spot.accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <motion.a
          href="/ai-planner"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-m text-[13px] font-bold text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${spot.accent}, ${spot.accent}cc)`,
            boxShadow: `0 4px 12px ${spot.accent}40`,
          }}
        >
          Plan Visit <ChevronRight size={14} />
        </motion.a>
      </div>
    </motion.div>
  );
}
