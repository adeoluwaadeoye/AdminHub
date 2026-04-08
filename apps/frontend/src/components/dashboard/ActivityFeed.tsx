"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  LogIn,
  Settings,
  Trash2,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

type ActivityType = "register" | "login" | "settings" | "delete" | "role" | "payment";

type Activity = {
  id: number;
  type: ActivityType;
  user: string;
  description: string;
  time: string;
};

const activities: Activity[] = [
  { id: 1, type: "register", user: "Alice Johnson", description: "Created a new account", time: "2 min ago" },
  { id: 2, type: "login", user: "Bob Smith", description: "Signed in from Chrome", time: "10 min ago" },
  { id: 3, type: "payment", user: "Carol White", description: "Completed a $120 payment", time: "25 min ago" },
  { id: 4, type: "role", user: "David Brown", description: "Promoted to Admin", time: "1 hr ago" },
  { id: 5, type: "settings", user: "Eva Green", description: "Updated account settings", time: "2 hr ago" },
  { id: 6, type: "delete", user: "Frank Lee", description: "Deleted their account", time: "3 hr ago" },
  { id: 7, type: "login", user: "Grace Kim", description: "Signed in from Safari", time: "5 hr ago" },
  { id: 8, type: "payment", user: "Henry Park", description: "Completed a $75 payment", time: "8 hr ago" },
];

const typeConfig: Record<ActivityType, { icon: React.ReactNode; color: string; badge: string }> = {
  register: {
    icon: <UserPlus className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-600",
    badge: "Register",
  },
  login: {
    icon: <LogIn className="h-4 w-4" />,
    color: "bg-green-100 text-green-600",
    badge: "Login",
  },
  settings: {
    icon: <Settings className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-600",
    badge: "Settings",
  },
  delete: {
    icon: <Trash2 className="h-4 w-4" />,
    color: "bg-red-100 text-red-600",
    badge: "Deleted",
  },
  role: {
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-600",
    badge: "Role",
  },
  payment: {
    icon: <CreditCard className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-700",
    badge: "Payment",
  },
};

export default function ActivityFeed() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="mb-5">
          <p className="font-semibold text-base">Activity Feed</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest actions across the platform
          </p>
        </div>

        {/* FEED */}
        <div className="relative space-y-0">

          {/* VERTICAL LINE */}
          <div className="absolute left-4.5 top-2 bottom-2 w-px bg-border" />

          {activities.map((activity) => {
            const config = typeConfig[activity.type];
            return (
              <div key={activity.id} className="flex gap-4 relative pb-5 last:pb-0">

                {/* ICON */}
                <div
                  className={`relative z-10 h-9 w-9 shrink-0 flex items-center justify-center rounded-full ${config.color}`}
                >
                  {config.icon}
                </div>

                {/* CONTENT */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <Badge className={`text-[10px] px-2 py-0 ${config.color}`}>
                        {config.badge}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}