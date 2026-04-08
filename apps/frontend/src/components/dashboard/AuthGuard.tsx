"use client";

import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  ShieldX,
  User,
  Lock,
  Unlock,
} from "lucide-react";

type Permission = {
  label: string;
  adminOnly: boolean;
};

const permissions: Permission[] = [
  { label: "View Dashboard", adminOnly: false },
  { label: "View Reports", adminOnly: false },
  { label: "Manage Users", adminOnly: true },
  { label: "Edit Settings", adminOnly: true },
  { label: "Delete Records", adminOnly: true },
  { label: "Access Billing", adminOnly: true },
  { label: "View Activity Logs", adminOnly: false },
  { label: "Export Data", adminOnly: true },
];

type Props = {
  // pass role from your user object — extend User type when ready
  role?: "admin" | "user";
};

export default function AuthGuard({ role = "user" }: Props) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = role === "admin";

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {isAdmin
              ? <ShieldCheck className="h-5 w-5 text-indigo-500" />
              : <ShieldX className="h-5 w-5 text-muted-foreground" />
            }
            <div>
              <p className="font-semibold text-base">Auth Guard</p>
              <p className="text-xs text-muted-foreground">
                Role-based access control
              </p>
            </div>
          </div>

          <Badge className={isAdmin
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-600"
          }>
            {isAdmin ? "Admin" : "User"}
          </Badge>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 mb-5">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100">
            <User className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "Not signed in"}</p>
          </div>
        </div>

        {/* PERMISSIONS */}
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Permissions
        </p>

        <div className="space-y-2">
          {permissions.map((p) => {
            const allowed = !p.adminOnly || isAdmin;
            return (
              <div
                key={p.label}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${allowed
                    ? "bg-background"
                    : "bg-muted/30 opacity-60"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {allowed
                    ? <Unlock className="h-3.5 w-3.5 text-green-500" />
                    : <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  }
                  <p className="text-sm">{p.label}</p>
                </div>

                <Badge className={`text-[10px] px-2 py-0 ${allowed
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                  {allowed ? "Allowed" : "Restricted"}
                </Badge>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}