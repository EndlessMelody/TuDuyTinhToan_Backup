"use client";

import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── CUSTOM PULSE MARKER ───
const createPulseIcon = (color: string = "#ff6b35") => {
  return L.divIcon({
    className: "custom-pulse-marker",
    html: `
      <div style="
        position: relative;
        width: 20px;
        height: 20px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 15px ${color};
      ">
        <div style="
          position: absolute;
          top: -3px;
          left: -3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.6;
          animation: marker-pulse 1.5s infinite ease-out;
        "></div>
      </div>
      <style>
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const previousCenterRef = useRef<[number, number]>(center);
  const previousZoomRef = useRef<number>(zoom);

  useEffect(() => {
    if (!map) return;

    const isSameCenter =
      Math.abs(previousCenterRef.current[0] - center[0]) < 1e-7 &&
      Math.abs(previousCenterRef.current[1] - center[1]) < 1e-7;
    const isSameZoom = Math.abs(previousZoomRef.current - zoom) < 1e-7;

    if (isSameCenter && isSameZoom) {
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      try {
        map.getContainer();

        map.stop();

        if (isSameCenter && !isSameZoom) {
          map.setZoom(zoom, { animate: true });
        } else if (!isSameCenter) {
          map.flyTo(center, zoom, {
            animate: true,
            duration: 0.55,
            easeLinearity: 0.2,
          });
        }

        previousCenterRef.current = center;
        previousZoomRef.current = zoom;
      } catch (e) {
        console.warn("Leaflet transition safely skipped:", e);
      }
    });

    return () => window.cancelAnimationFrame(raf);
  }, [center, zoom, map]);

  return null;
}

interface MapWidgetProps {
  mapId?: string; // Add a unique ID for multiple map instances
  points?: [number, number][];
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  userLocation?: [number, number] | null;
  showBanner?: boolean;
}

export default function MapWidget({
  mapId = "default-map",
  points = [],
  center = [10.897, 106.772],
  zoom = 14,
  minZoom = 3,
  maxZoom = 19,
  userLocation = null,
  showBanner = true,
}: MapWidgetProps) {
  // ─── CRITICAL STABILITY LAYER ───
  // useSyncExternalStore is the React-safe way to detect client vs server
  // without calling setState inside useEffect (which triggers cascading renders).
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // Generate a stable unique key using useId to force a fresh DOM container per instance
  const uid = useId();
  const instanceKey = `map-instance-${mapId}-${uid}`;

  const pulseIcon = useMemo(() => createPulseIcon("#ff6b35"), []);
  const activePulseIcon = useMemo(() => createPulseIcon("#FF2D55"), []);
  const userPulseIcon = useMemo(() => createPulseIcon("#0A84FF"), []);

  // Return a stable placeholder if not mounted or in a transition state
  if (!isMounted) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#F8FAFF",
          borderRadius: "inherit",
        }}
      />
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        zIndex: 0,
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      <MapContainer
        key={instanceKey} // FORCE A FRESH DOM ATOM TO PREVENT REUSE ERRORS
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomSnap={0.25}
        zoomDelta={0.25}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", backgroundColor: "#F8FAFF" }}
        zoomControl={false}
        attributionControl={false}
      >
        <ChangeView center={center} zoom={zoom} />

        {/* OpenStreetMap official tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={maxZoom}
        />

        {/* Existing Route Connections - Safely mapped with static key */}
        {points.length > 1 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#ff6b35",
              weight: 5,
              opacity: 0.3,
              dashArray: "1, 12",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* Markers with unique keys to prevent add/remove sync issues */}
        {points.map((p, idx) => (
          <Marker
            key={`${instanceKey}-marker-${idx}-${p[0]}-${p[1]}`}
            position={p}
            icon={idx === points.length - 1 ? activePulseIcon : pulseIcon}
          />
        ))}

        {/* User marker */}
        {userLocation && (
          <Marker
            key={`${instanceKey}-user-${userLocation[0]}-${userLocation[1]}`}
            position={userLocation}
            icon={userPulseIcon}
          />
        )}

        {/* Base center marker if no points */}
        {points.length === 0 && (
          <Marker
            key={`${instanceKey}-base-center`}
            position={center}
            icon={pulseIcon}
          />
        )}
      </MapContainer>

      {/* Absolute overlay elements for UI */}
      {showBanner && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 1000,
            padding: "8px 16px",
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
            border: "1px solid rgba(0,122,255,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 12px 32px rgba(0,122,255,0.1)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              boxShadow: "0 0 12px rgba(255,107,53,0.6)",
            }}
          />
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#1C1C1E",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Exploring Area
          </span>
        </div>
      )}
    </div>
  );
}
