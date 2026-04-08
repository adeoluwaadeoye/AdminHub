"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", profit: 1200 },
  { day: "Tue", profit: 1800 },
  { day: "Wed", profit: 1400 },
  { day: "Thu", profit: 2200 },
  { day: "Fri", profit: 2800 },
  { day: "Sat", profit: 2100 },
  { day: "Sun", profit: 3100 },
];

const total   = data.reduce((sum, d) => sum + d.profit, 0);
const lastWeek = 11200;
const diff    = total - lastWeek;
const isUp    = diff >= 0;
const pct     = ((Math.abs(diff) / lastWeek) * 100).toFixed(1);

export default function WeeklyProfit() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold text-base">Weekly Profit</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revenue earned this week
            </p>
          </div>

          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100">
            <DollarSign className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* BIG NUMBER */}
        <div className="flex items-end gap-3 mb-4">
          <p className="text-3xl font-bold">
            ${total.toLocaleString()}
          </p>
          <Badge className={`mb-1 gap-1 text-xs ${
            isUp
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {isUp
              ? <TrendingUp className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />
            }
            {isUp ? "+" : "-"}{pct}% vs last week
          </Badge>
        </div>

        {/* AREA CHART */}
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => {
                const amount = typeof value === "number"
                  ? value
                  : typeof value === "string"
                    ? Number(value)
                    : 0;

                return [`$${amount.toLocaleString()}`, "Profit"];
              }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* DAY BREAKDOWN */}
        <div className="grid grid-cols-7 gap-1 mt-4">
          {data.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <p className="text-[10px] text-muted-foreground">{d.day}</p>
              <div className="w-full rounded-full bg-muted overflow-hidden h-1.5">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(d.profit / 3100) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-medium">${(d.profit / 1000).toFixed(1)}k</p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}