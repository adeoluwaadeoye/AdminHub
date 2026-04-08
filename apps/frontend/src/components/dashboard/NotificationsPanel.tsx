"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShieldCheck,
  CreditCard,
  UserPlus,
  AlertTriangle,
  Info,
  Check,
} from "lucide-react";

type NotifType = "security" | "payment" | "user" | "warning" | "info";

type Notification = {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const initialNotifs: Notification[] = [
  { id: 1, type: "security", title: "New login detected", description: "Sign-in from a new device in Lagos, NG", time: "2 min ago", read: false },
  { id: 2, type: "payment", title: "Payment received", description: "Alice Johnson paid $120 successfully", time: "15 min ago", read: false },
  { id: 3, type: "user", title: "New user registered", description: "Bob Smith just created an account", time: "1 hr ago", read: false },
  { id: 4, type: "warning", title: "High CPU usage", description: "Server load exceeded 85% threshold", time: "2 hr ago", read: true },
  { id: 5, type: "info", title: "System update", description: "Scheduled maintenance on Sunday 2am", time: "3 hr ago", read: true },
  { id: 6, type: "payment", title: "Payment failed", description: "Carol White — card declined", time: "5 hr ago", read: true },
  { id: 7, type: "security", title: "Password changed", description: "Eva Green updated her password", time: "8 hr ago", read: true },
];

const typeConfig: Record<NotifType, { icon: React.ReactNode; color: string }> = {
  security: { icon: <ShieldCheck className="h-4 w-4" />, color: "bg-blue-100 text-blue-600" },
  payment: { icon: <CreditCard className="h-4 w-4" />, color: "bg-green-100 text-green-600" },
  user: { icon: <UserPlus className="h-4 w-4" />, color: "bg-purple-100 text-purple-600" },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-700" },
  info: { icon: <Info className="h-4 w-4" />, color: "bg-gray-100 text-gray-600" },
};

type Filter = "all" | "unread";

export default function NotificationsPanel() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const displayed =
    filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <p className="font-semibold text-base">Notifications</p>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] px-2 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* FILTER */}
            <div className="flex gap-1 rounded-lg border p-1">
              {(["all", "unread"] as Filter[]).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "ghost"}
                  className="text-xs h-7 px-3 capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>

            {/* MARK ALL READ */}
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 gap-1"
                onClick={markAllRead}
              >
                <Check className="h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {displayed.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            displayed.map((n) => {
              const config = typeConfig[n.type];
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${n.read
                      ? "bg-transparent hover:bg-muted/40"
                      : "bg-muted/60 hover:bg-muted"
                    }`}
                >
                  {/* ICON */}
                  <div
                    className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full ${config.color}`}
                  >
                    {config.icon}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!n.read ? "font-semibold" : "font-medium"}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {n.description}
                    </p>
                  </div>

                  {/* UNREAD DOT */}
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>

      </CardContent>
    </Card>
  );
}