"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Region = {
  id: string;
  name: string;
  users: number;
  revenue: number;
  growth: string;
  positive: boolean;
  lat: number;
  lng: number;
};

type Props = {
  regions: Region[];
  active: Region | null;
  onSelect: (r: Region | null) => void;
};

// ── auto-fly to active region ──────────────────────────────
function FlyTo({ active }: { active: Region | null }) {
  const map = useMap();
  useEffect(() => {
    if (active) {
      map.flyTo([active.lat, active.lng], 4, { duration: 1.2 });
    } else {
      map.flyTo([20, 10], 2, { duration: 1.2 });
    }
  }, [active, map]);
  return null;
}

export default function MapInner({ regions, active, onSelect }: Props) {
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      maxZoom={10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      {/* FREE TILE LAYER — no API key needed */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyTo active={active} />

      {regions.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={Math.max(8, Math.sqrt(r.users / 100))} // ✅ size = user count
          pathOptions={{
            fillColor: active?.id === r.id ? "#4f46e5" : "#6366f1",
            fillOpacity: active?.id === r.id ? 0.95 : 0.75,
            color: "#ffffff",
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelect(r.id === active?.id ? null : r),
          }}
        >
          <Popup className="text-sm">
            <div className="space-y-1 min-w-32">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-gray-500">
                {r.users.toLocaleString()} users
              </p>
              <p className="text-xs text-gray-500">
                ${r.revenue.toLocaleString()} revenue
              </p>
              <span className={`text-xs font-medium ${r.positive ? "text-green-600" : "text-red-500"
                }`}>
                {r.growth}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}