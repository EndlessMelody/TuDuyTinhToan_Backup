"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom red icon for the map center
const customRedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapWidget() {
  const position: [number, number] = [10.897, 106.772]; // Dĩ An, Bình Dương coordinates

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', backgroundColor: '#F2F2F7' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dark Matter theme from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={customRedIcon} />
      </MapContainer>
      
      {/* Absolute overlay elements for UI */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1000, padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid #E5E5EA', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#ED1B24', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1C1C1E' }}>LIVE</span>
      </div>
    </div>
  );
}
