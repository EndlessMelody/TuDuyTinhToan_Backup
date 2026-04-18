"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { CATEGORIES, PRICE_ICONS, SPOTS } from "./data";
import type { Spot } from "./types";
import { CATEGORY_ICONS } from "./ui-constants";
import SpotCard from "./components/SpotCard";
import DetailOverlay from "./components/DetailOverlay";

const MapWidget = dynamic(() => import("@/components/MapWidget"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F2F2F7] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#E5E5EA] border-t-[#ff6b35] animate-spin" />
    </div>
  ),
});

const FALLBACK_CENTER: [number, number] = [10.899, 106.774];
const MIN_MAP_ZOOM = 3;
const MAX_MAP_ZOOM = 19;

function toLocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission denied.";
    case error.POSITION_UNAVAILABLE:
      return "GPS signal unavailable.";
    case error.TIMEOUT:
      return "Location request timed out.";
    default:
      return "Could not determine your location.";
  }
}

export default function ExploreClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<1 | 2 | 3>(3);
  const [selected, setSelected] = useState<Spot | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [userLocationError, setUserLocationError] = useState<string | null>(
    null,
  );
  const [manualZoom, setManualZoom] = useState<number | null>(null);

  const getCurrentPosition = useCallback(
    (options: PositionOptions) =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      }),
    [],
  );

  const detectUserLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setUserLocationError("GPS is unavailable in this browser.");
      return;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1";

    if (!window.isSecureContext && !isLocalhost) {
      setUserLocationError("Location requires HTTPS (or localhost).");
      return;
    }

    setIsLocatingUser(true);
    setUserLocationError(null);

    try {
      // First attempt: precise GPS fix.
      const precise = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      setSelected(null);
      setUserLocation([precise.coords.latitude, precise.coords.longitude]);
      setIsLocatingUser(false);
      return;
    } catch (firstError) {
      const geoError = firstError as GeolocationPositionError;

      if (
        geoError.code === geoError.PERMISSION_DENIED ||
        geoError.code === geoError.POSITION_UNAVAILABLE
      ) {
        try {
          // Fallback: less strict + cached location can still place user on map.
          const fallback = await getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 5 * 60 * 1000,
          });

          setSelected(null);
          setUserLocation([
            fallback.coords.latitude,
            fallback.coords.longitude,
          ]);
          setIsLocatingUser(false);
          return;
        } catch (fallbackError) {
          setUserLocationError(
            toLocationErrorMessage(fallbackError as GeolocationPositionError),
          );
          setIsLocatingUser(false);
          return;
        }
      }

      setUserLocationError(toLocationErrorMessage(geoError));
      setIsLocatingUser(false);
    }
  }, [getCurrentPosition]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void detectUserLocation();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [detectUserLocation]);

  const filtered = useMemo(
    () =>
      SPOTS.filter((spot) => {
        const matchCat = category === "All" || spot.category === category;
        const matchOpen = !openOnly || spot.isOpen;
        const matchPrice = spot.priceLevel <= priceMax;
        const query = search.trim().toLowerCase();
        const matchQuery =
          !query ||
          spot.name.toLowerCase().includes(query) ||
          spot.category.toLowerCase().includes(query);

        return matchCat && matchOpen && matchPrice && matchQuery;
      }),
    [category, openOnly, priceMax, search],
  );

  const mapCenter: [number, number] = selected
    ? [selected.lat, selected.lon]
    : (userLocation ?? FALLBACK_CENTER);
  const mapZoomFromContext = selected ? 17 : userLocation ? 16 : 15;
  const mapZoom = Math.max(
    MIN_MAP_ZOOM,
    Math.min(MAX_MAP_ZOOM, manualZoom ?? mapZoomFromContext),
  );
  const mapPoints = filtered.map(
    (spot) => [spot.lat, spot.lon] as [number, number],
  );

  const setZoomLevel = useCallback((value: number) => {
    const clamped = Math.max(MIN_MAP_ZOOM, Math.min(MAX_MAP_ZOOM, value));
    setManualZoom(clamped);
  }, []);
  const stepZoom = useCallback(
    (delta: number) => {
      setManualZoom((previous) => {
        const base = previous ?? mapZoomFromContext;
        return Math.max(MIN_MAP_ZOOM, Math.min(MAX_MAP_ZOOM, base + delta));
      });
    },
    [mapZoomFromContext],
  );
  const zoomLabel = Number.isInteger(mapZoom)
    ? String(mapZoom)
    : mapZoom.toFixed(2);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <MapWidget
          mapId="explore-main"
          points={mapPoints}
          center={mapCenter}
          zoom={mapZoom}
          minZoom={MIN_MAP_ZOOM}
          maxZoom={MAX_MAP_ZOOM}
          userLocation={userLocation}
          showBanner={false}
        />

        <AnimatePresence>
          {selected && (
            <DetailOverlay spot={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3.5 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.06)",
            right: "376px",
          }}
        >
          <MapPin size={14} className="text-[#ff6b35]" />
          <span className="text-[13px] font-bold text-[#1C1C1E]">
            {filtered.length} spots
          </span>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onClick={detectUserLocation}
          className="absolute top-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full"
          style={{
            left: "calc(var(--explore-left-sidebar-width, 0px) + 16px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            border: userLocationError
              ? "1px solid rgba(220,38,38,0.25)"
              : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <LocateFixed
            size={14}
            className={isLocatingUser ? "animate-spin" : undefined}
            color={
              userLocationError
                ? "#dc2626"
                : userLocation
                  ? "#0A84FF"
                  : "#8E8E93"
            }
          />
          <span className="text-[12px] font-bold text-[#1C1C1E]">
            {isLocatingUser
              ? "Locating..."
              : userLocationError
                ? userLocationError
                : userLocation
                  ? "You are here"
                  : "Use my location"}
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="absolute z-40"
          style={{
            left: "calc(var(--explore-left-sidebar-width, 0px) + 16px)",
            top: "66px",
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel(MAX_MAP_ZOOM)}
              className="w-8 h-5 rounded-full text-[8px] font-extrabold text-white"
              title="Set maximum zoom"
              style={{
                backgroundColor: "rgba(17,24,39,0.78)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              MAX
            </button>

            <button
              type="button"
              onClick={() => stepZoom(1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white"
              title="Zoom in"
              style={{
                backgroundColor: "rgba(17,24,39,0.78)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <Plus size={12} />
            </button>

            <div
              style={{
                height: "96px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                type="range"
                min={MIN_MAP_ZOOM}
                max={MAX_MAP_ZOOM}
                step={0.25}
                value={mapZoom}
                onChange={(event) =>
                  setZoomLevel(Number(event.currentTarget.value))
                }
                className="zoom-stick-input w-20"
                style={{
                  transform: "rotate(-90deg) scale(0.88)",
                  transformOrigin: "center",
                  accentColor: "#111827",
                  cursor: "pointer",
                }}
                title="Zoom stick"
              />
            </div>

            <button
              type="button"
              onClick={() => stepZoom(-1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white"
              title="Zoom out"
              style={{
                backgroundColor: "rgba(17,24,39,0.78)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              <Minus size={12} />
            </button>

            <button
              type="button"
              onClick={() => setZoomLevel(MIN_MAP_ZOOM)}
              className="w-8 h-5 rounded-full text-[8px] font-extrabold text-white"
              title="Set minimum zoom"
              style={{
                backgroundColor: "rgba(17,24,39,0.78)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              MIN
            </button>

            <span className="text-[8px] font-bold text-[#1F2937]">z{zoomLabel}</span>
          </div>
        </motion.div>

        <style jsx>{`
          .zoom-stick-input {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
          }

          .zoom-stick-input::-webkit-slider-runnable-track {
            height: 3px;
            border-radius: 999px;
            background: rgba(17, 24, 39, 0.68);
          }

          .zoom-stick-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid rgba(17, 24, 39, 0.95);
            margin-top: -3.5px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          }

          .zoom-stick-input::-moz-range-track {
            height: 3px;
            border-radius: 999px;
            background: rgba(17, 24, 39, 0.68);
          }

          .zoom-stick-input::-moz-range-thumb {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid rgba(17, 24, 39, 0.95);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          }
        `}</style>
      </div>

      <div
        className="no-scrollbar"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "360px",
          backgroundColor: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px)",
          borderLeft: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: "24px 20px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={20} className="text-[#ff6b35]" />
            <h1 className="text-[22px] font-extrabold text-[#1C1C1E] tracking-tight">
              Explore
            </h1>
          </div>
          <p className="text-[13px] text-[#8E8E93]">
            {filtered.length} spots · Ho Chi Minh City
          </p>

          <div className="relative mt-3">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spots, cuisines..."
              className="w-full pl-9 pr-9 py-2.5 rounded-m text-[14px] outline-none transition-all"
              style={{
                backgroundColor: "#F2F2F7",
                border: "1.5px solid transparent",
                color: "#1C1C1E",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div
          className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.93 }}
              onClick={() => setCategory(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all"
              style={
                category === cat
                  ? {
                      backgroundColor: "#1C1C1E",
                      borderColor: "#1C1C1E",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "#F2F2F7",
                      borderColor: "transparent",
                      color: "#3C3C43",
                    }
              }
            >
              {CATEGORY_ICONS[cat]} {cat}
            </motion.button>
          ))}
        </div>

        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          <SlidersHorizontal size={14} className="text-[#8E8E93]" />

          <button
            onClick={() => setOpenOnly((value) => !value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all"
            style={
              openOnly
                ? {
                    backgroundColor: "#34C759",
                    borderColor: "#34C759",
                    color: "#fff",
                  }
                : {
                    backgroundColor: "#F2F2F7",
                    borderColor: "transparent",
                    color: "#3C3C43",
                  }
            }
          >
            <Clock size={12} /> Open Now
          </button>

          <div className="flex gap-1">
            {([1, 2, 3] as const).map((price) => (
              <button
                key={price}
                onClick={() => setPriceMax(price)}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-all"
                style={
                  priceMax === price
                    ? {
                        backgroundColor: "#1C1C1E",
                        borderColor: "#1C1C1E",
                        color: "#fff",
                      }
                    : {
                        backgroundColor: "#F2F2F7",
                        borderColor: "transparent",
                        color: "#8E8E93",
                      }
                }
              >
                {PRICE_ICONS[price]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col px-3 py-2 gap-1">
          <AnimatePresence>
            {filtered.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                selected={selected?.id === spot.id}
                onClick={() =>
                  setSelected((prev) => (prev?.id === spot.id ? null : spot))
                }
              />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(142,142,147,0.1)",
                  color: "#8E8E93",
                }}
              >
                <SearchX size={28} />
              </div>
              <p className="text-[15px] font-bold text-[#1C1C1E]">
                No spots match
              </p>
              <p className="text-[13px] text-[#8E8E93]">
                Try clearing some filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
