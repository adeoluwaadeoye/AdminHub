"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter }    from "next/navigation";
import { useEffect }    from "react";

import { Button }       from "@/components/ui/button";  // ✅ added
import { CheckSquare }  from "lucide-react";       

// ── KPI & STATS ───────────────────────────────────────────
import WeeklyProfit    from "@/components/dashboard/WeeklyProfit";
import UsedDevices     from "@/components/dashboard/UsedDevices";
import RegionalLabels  from "@/components/dashboard/RegionalLabels";
import PaymentOverview from "@/components/dashboard/PaymentOverview";

// ── CHARTS ────────────────────────────────────────────────
import LineBarChart    from "@/components/dashboard/LineBarChart";
import TopChannels     from "@/components/dashboard/TopChannels";

// ── DATA ──────────────────────────────────────────────────
import DataTable       from "@/components/dashboard/DataTable";
import ActivityFeed    from "@/components/dashboard/ActivityFeed";

// ── MANAGEMENT ────────────────────────────────────────────
import KanbanBoard     from "@/components/dashboard/KanbanBoard";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

// ── TOOLS ─────────────────────────────────────────────────
import CalendarSchedule from "@/components/dashboard/CalendarSchedule";
import MapWidget        from "@/components/dashboard/MapWidget";
import AuthGuard        from "@/components/dashboard/AuthGuard";
import ProfileSettings  from "@/components/dashboard/ProfileSettings";
import Link from "next/link";

export default function DashboardPage() {
  const user        = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const router      = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push("/auth/login");
    }
  }, [user, initialized, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* ── WELCOME STRIP ──────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening across your workspace today.
          </p>
        </div>

        {/* quick link to tasks */}
    <Link href="/dashboard/tasks">
      <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
        <CheckSquare className="h-4 w-4" />
        My Tasks
      </Button>
    </Link>
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}
        </div>
      </div>

      {/* ── ROW 1 — PROFIT + DEVICES + REGIONAL ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <WeeklyProfit />
        <UsedDevices />
        <RegionalLabels />
      </div>

      {/* ── ROW 2 — LINE/BAR CHART + TOP CHANNELS ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LineBarChart />
        <TopChannels />
      </div>

      {/* ── ROW 3 — PAYMENT + NOTIFICATIONS ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PaymentOverview />
        <NotificationsPanel />
      </div>

      {/* ── ROW 4 — DATA TABLE (full width) ─────────────── */}
      <div>
        <DataTable />
      </div>

      {/* ── ROW 5 — KANBAN (full width) ──────────────────── */}
      <div>
        <KanbanBoard />
      </div>

      {/* ── ROW 6 — ACTIVITY + CALENDAR ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityFeed />
        <CalendarSchedule />
      </div>

      {/* ── ROW 7 — MAP + AUTH GUARD ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MapWidget />
        <AuthGuard role={
          (user as unknown as { role?: "admin" | "user" })?.role ?? "user"
        } />
      </div>

      {/* ── ROW 8 — PROFILE SETTINGS (full width) ────────── */}
      <div>
        <ProfileSettings />
      </div>

    </div>
  );
}