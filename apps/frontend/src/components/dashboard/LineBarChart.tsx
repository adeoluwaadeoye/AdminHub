"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const weeklyData = [
  { name: "Mon", revenue: 4000, users: 240 },
  { name: "Tue", revenue: 3000, users: 139 },
  { name: "Wed", revenue: 5000, users: 380 },
  { name: "Thu", revenue: 2780, users: 190 },
  { name: "Fri", revenue: 6890, users: 480 },
  { name: "Sat", revenue: 2390, users: 150 },
  { name: "Sun", revenue: 3490, users: 210 },
];

const monthlyData = [
  { name: "Jan", revenue: 24000, users: 1200 },
  { name: "Feb", revenue: 18000, users: 980 },
  { name: "Mar", revenue: 32000, users: 1500 },
  { name: "Apr", revenue: 27000, users: 1350 },
  { name: "May", revenue: 41000, users: 2100 },
  { name: "Jun", revenue: 38000, users: 1900 },
];

type Range = "weekly" | "monthly";

export default function LineBarChart() {
  const [range, setRange] = useState<Range>("weekly");
  const data = range === "weekly" ? weeklyData : monthlyData;

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-base">Revenue & Users</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Combined traffic overview
            </p>
          </div>

          {/* RANGE TOGGLE */}
          <div className="flex gap-1 rounded-lg border p-1">
            {(["weekly", "monthly"] as Range[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "ghost"}
                className="text-xs h-7 px-3 capitalize"
                onClick={() => setRange(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              name="Revenue ($)"
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Users"
            />
          </ComposedChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
}