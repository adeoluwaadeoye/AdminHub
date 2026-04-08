"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

type Region = {
  country: string;
  flag: string;
  users: number;
  revenue: number;
  share: number;
  color: string;
};

const regions: Region[] = [
  { country: "United States", flag: "🇺🇸", users: 8400, revenue: 52000, share: 34, color: "#6366f1" },
  { country: "United Kingdom", flag: "🇬🇧", users: 4200, revenue: 28000, share: 18, color: "#f59e0b" },
  { country: "Nigeria", flag: "🇳🇬", users: 3100, revenue: 14000, share: 13, color: "#10b981" },
  { country: "Germany", flag: "🇩🇪", users: 2800, revenue: 19000, share: 11, color: "#3b82f6" },
  { country: "India", flag: "🇮🇳", users: 5600, revenue: 21000, share: 22, color: "#ec4899" },
  { country: "Australia", flag: "🇦🇺", users: 1200, revenue: 8500, share: 5, color: "#14b8a6" },
];

export default function RegionalLabels() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold text-base">Regional Labels</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Users and revenue by country
            </p>
          </div>
        </div>

        {/* STACKED BAR */}
        <div className="flex w-full h-3 rounded-full overflow-hidden mb-5">
          {regions.map((r) => (
            <div
              key={r.country}
              style={{ width: `${r.share}%`, backgroundColor: r.color }}
              title={`${r.country}: ${r.share}%`}
            />
          ))}
        </div>

        {/* LEGEND DOTS */}
        <div className="flex flex-wrap gap-3 mb-5">
          {regions.map((r) => (
            <div key={r.country} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: r.color }}
              />
              <span className="text-xs text-muted-foreground">{r.country}</span>
            </div>
          ))}
        </div>

        {/* ROWS */}
        <div className="space-y-3">
          {regions.map((r) => (
            <div key={r.country} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.flag}</span>
                  <p className="text-sm font-medium">{r.country}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    {r.users.toLocaleString()} users
                  </p>
                  <p className="text-xs font-medium">
                    ${(r.revenue / 1000).toFixed(0)}k
                  </p>
                  <Badge
                    className="text-[10px] px-2 py-0 text-white"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.share}%
                  </Badge>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${r.share}%`, backgroundColor: r.color }}
                />
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}