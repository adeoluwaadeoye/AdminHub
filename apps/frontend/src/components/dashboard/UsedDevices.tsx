"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type Device = {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

const devices: Device[] = [
  { name: "Desktop", value: 54, color: "#6366f1", icon: <Monitor className="h-4 w-4" /> },
  { name: "Mobile",  value: 35, color: "#f59e0b", icon: <Smartphone className="h-4 w-4" /> },
  { name: "Tablet",  value: 11, color: "#10b981", icon: <Tablet className="h-4 w-4" /> },
];

export default function UsedDevices() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="mb-4">
          <p className="font-semibold text-base">Used Devices</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Traffic breakdown by device type
          </p>
        </div>

        {/* DONUT CHART */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={devices}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {devices.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value ?? 0}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER LABEL */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold">100%</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* LEGEND */}
        <div className="space-y-3 mt-2">
          {devices.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${d.color}20`, color: d.color }}
                >
                  {d.icon}
                </div>
                <p className="text-sm font-medium">{d.name}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* PROGRESS BAR */}
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.value}%`, backgroundColor: d.color }}
                  />
                </div>
                <p className="text-sm font-semibold w-8 text-right">
                  {d.value}%
                </p>
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}