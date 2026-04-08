"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

// dynamically import map to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("./MapInner"), { ssr: false });

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

export const regions: Region[] = [
  { id: "na", name: "North America", users: 12400, revenue: 84000, growth: "+12%", positive: true,  lat: 40.7128,  lng: -74.006  },
  { id: "sa", name: "South America", users: 4200,  revenue: 21000, growth: "+8%",  positive: true,  lat: -15.7801, lng: -47.9292 },
  { id: "eu", name: "Europe",        users: 9800,  revenue: 67000, growth: "+5%",  positive: true,  lat: 51.5074,  lng: -0.1278  },
  { id: "af", name: "Africa",        users: 3100,  revenue: 12000, growth: "-2%",  positive: false, lat: 1.2921,   lng: 36.8219  },
  { id: "as", name: "Asia",          users: 18600, revenue: 95000, growth: "+21%", positive: true,  lat: 35.6762,  lng: 139.6503 },
  { id: "oc", name: "Oceania",       users: 1900,  revenue: 9500,  growth: "+3%",  positive: true,  lat: -33.8688, lng: 151.2093 },
  { id: "ng", name: "Nigeria",       users: 3100,  revenue: 14000, growth: "+7%",  positive: true,  lat: 6.5244,   lng: 3.3792   },
];

export default function MapWidget() {
  const [active, setActive] = useState<Region | null>(null);

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-base">Global User Map</p>
              <p className="text-xs text-muted-foreground">
                Click a pin to inspect region
              </p>
            </div>
          </div>
          {active && (
            <button
              onClick={() => setActive(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden border h-64 md:h-80 w-full">
          <MapWithNoSSR
            regions={regions}
            active={active}
            onSelect={setActive}
          />
        </div>

        {/* SELECTED REGION DETAIL */}
        {active && (
          <div className="mt-4 rounded-xl border bg-muted/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">{active.name}</p>
              <Badge className={
                active.positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }>
                {active.growth}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background p-3 text-center border">
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-lg font-bold">
                  {active.users.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-background p-3 text-center border">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold">
                  ${active.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REGION LIST */}
        <div className="mt-4 space-y-2">
          {regions.map((r) => (
            <div
              key={r.id}
              onClick={() => setActive(r.id === active?.id ? null : r)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                active?.id === r.id
                  ? "bg-indigo-50 dark:bg-indigo-950"
                  : "hover:bg-muted/50"
              }`}
            >
              <p className="text-sm font-medium">{r.name}</p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {r.users.toLocaleString()} users
                </p>
                <Badge className={`text-[10px] px-2 py-0 ${
                  r.positive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {r.growth}
                </Badge>
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}