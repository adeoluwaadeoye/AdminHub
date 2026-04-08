"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

type Channel = {
  name: string;
  icon: React.ReactNode;
  visits: number;
  conversions: number;
  revenue: number;
  trend: "up" | "down";
  trendValue: string;
};

const channels: Channel[] = [
  {
    name: "Google",
    icon: <FcGoogle className="h-5 w-5" />,
    visits: 18400, conversions: 820, revenue: 42000,
    trend: "up", trendValue: "+14%",
  },
  {
    name: "GitHub",
    icon: <FaGithub className="h-5 w-5" />,
    visits: 9200, conversions: 410, revenue: 18500,
    trend: "up", trendValue: "+9%",
  },
  {
    name: "Twitter",
    icon: <FaTwitter className="h-5 w-5 text-sky-500" />,
    visits: 6800, conversions: 210, revenue: 9800,
    trend: "down", trendValue: "-3%",
  },
  {
    name: "Facebook",
    icon: <FaFacebook className="h-5 w-5 text-blue-600" />,
    visits: 5100, conversions: 180, revenue: 7200,
    trend: "up", trendValue: "+5%",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin className="h-5 w-5 text-blue-700" />,
    visits: 3400, conversions: 140, revenue: 5600,
    trend: "down", trendValue: "-1%",
  },
];

const maxVisits = Math.max(...channels.map((c) => c.visits));

export default function TopChannels() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-5">
          <Radio className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold text-base">Top Channels</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Traffic sources by visits & revenue
            </p>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 text-xs text-muted-foreground font-medium mb-2 px-1">
          <div className="col-span-4">Channel</div>
          <div className="col-span-3 text-right">Visits</div>
          <div className="col-span-3 text-right">Revenue</div>
          <div className="col-span-2 text-right">Trend</div>
        </div>

        {/* ROWS */}
        <div className="space-y-3">
          {channels.map((c) => (
            <div key={c.name}>
              <div className="grid grid-cols-12 items-center px-1">

                {/* CHANNEL NAME */}
                <div className="col-span-4 flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted shrink-0">
                    {c.icon}
                  </div>
                  <p className="text-sm font-medium truncate">{c.name}</p>
                </div>

                {/* VISITS */}
                <div className="col-span-3 text-right">
                  <p className="text-sm">{c.visits.toLocaleString()}</p>
                </div>

                {/* REVENUE */}
                <div className="col-span-3 text-right">
                  <p className="text-sm">${(c.revenue / 1000).toFixed(1)}k</p>
                </div>

                {/* TREND */}
                <div className="col-span-2 flex justify-end">
                  <Badge className={`text-[10px] px-2 py-0 ${
                    c.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {c.trendValue}
                  </Badge>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                  style={{ width: `${(c.visits / maxVisits) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}