"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * FINAL PRODUCTION BAR CHART (GENERIC + STRICT TYPES)
 */

// Generic props with strict typing (NO any)
type BarChartProps<T extends Record<string, unknown>> = {
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  height?: number;
};

export default function BarChart<T extends Record<string, unknown>>({
  data,
  labelKey,
  valueKey,
  height = 300,
}: BarChartProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background rounded-2xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Axes */}
          <XAxis dataKey={labelKey as string} />
          <YAxis />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />

          {/* Bars */}
          <Bar
            dataKey={valueKey as string}
            radius={[8, 8, 0, 0]}
            fill="#6366f1"
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * USAGE:
 *
 * <BarChart
 *   data={chartData}
 *   labelKey="name"
 *   valueKey="users"
 * />
 */