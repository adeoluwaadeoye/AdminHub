"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  LogOut,
  LogIn,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Shield,
  X,
} from "lucide-react";
import { ThemeToggleSwitch } from "@/components/shared/theme/ThemeToggle";
import SidebarSheet from "@/components/layout/SidebarSheet";
import { toast } from "sonner";
import { useState } from "react";

type Notif = {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  color: string;
};

const mockNotifs: Notif[] = [
  { id: 1, title: "New user registered", desc: "Alice Johnson just signed up", time: "2m ago", read: false, color: "bg-blue-500" },
  { id: 2, title: "Payment received", desc: "Bob Smith paid $120", time: "15m ago", read: false, color: "bg-green-500" },
  { id: 3, title: "Server warning", desc: "CPU usage exceeded 85%", time: "1h ago", read: false, color: "bg-yellow-500" },
  { id: 4, title: "New login detected", desc: "Sign-in from Lagos, NG", time: "2h ago", read: true, color: "bg-indigo-500" },
  { id: 5, title: "Scheduled maintenance", desc: "Downtime Sunday 2am–4am", time: "3h ago", read: true, color: "bg-gray-400" },
];

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const logout = useAuthStore((s) => s.logout);

  const [notifs, setNotifs] = useState<Notif[]>(mockNotifs);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unread = notifs.filter((n) => !n.read).length;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully.");
    router.replace("/");
  };

  const handleLogin = () => router.push("/auth/login");

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  if (!initialized) return null;

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-3">
      <div className="w-full max-w-7xl  rounded-2xl border bg-background/95 backdrop-blur-sm shadow-sm  [@media(max-width:325px)]:w-fit">
        <div className="flex h-16 items-center justify-between px-3 md:px-6">

          {/* ===================== LEFT ===================== */}
          <div className="flex items-center gap-2 md:gap-5">

            {/* SIDEBAR TRIGGER */}
            <SidebarSheet>
              <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0">
                <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              </button>
            </SidebarSheet>

            {/* BRAND */}
            <Link
              href="/"
              className="hidden [@media(min-width:385px)]:flex items-center gap-1.5 border-r pr-3 md:pr-4 shrink-0 hover:opacity-80 transition-opacity"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight hidden sm:block">
                AdminHub
              </span>
            </Link>

            {/* DESKTOP SEARCH — hidden on mobile */}
            <div className="hidden lg:flex items-center">
              <div className="relative w-48 lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border bg-muted/50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===================== RIGHT ===================== */}
          {/* gap-3 on mobile, gap-4 on tablet, gap-5 on desktop */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">

            {/* MOBILE SEARCH TOGGLE — hidden on md+ */}
            <button
              onClick={() => setSearchOpen((p) => !p)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0 mr-12"
            >
              {searchOpen
                ? <X className="h-5 w-5 text-muted-foreground" />
                : <Search className="h-5 w-5 text-muted-foreground" />
              }
            </button>

            {/* THEME TOGGLE */}
            <div className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0 mr-10 [@media(min-width:380px)]:mr-10">
              <ThemeToggleSwitch />
            </div>

            {/* NOTIFICATIONS — only when logged in */}
            {user && (
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                        {unread}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-80 p-0 overflow-hidden"
                >
                  {/* NOTIF HEADER */}
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">Notifications</p>
                      {unread > 0 && (
                        <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4">
                          {unread}
                        </Badge>
                      )}
                    </div>
                    {unread > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* NOTIF LIST */}
                  <div className="max-h-72 overflow-y-auto divide-y">
                    {notifs.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifs.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors ${!n.read ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                            }`}
                        >
                          <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${!n.read ? "font-semibold" : ""}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {n.desc}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {n.time}
                            </p>
                          </div>
                          <button
                            onClick={() => dismiss(n.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5 mr-12"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* NOTIF FOOTER */}
                  <div className="border-t px-4 py-2.5 bg-muted/20">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium w-full text-center transition-colors">
                      View all notifications
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* DIVIDER — desktop only */}
            <div className="hidden md:block h-6 w-px bg-border shrink-0" />

            {/* PROFILE DROPDOWN */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-muted transition-colors shrink-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      {user ? getInitials(user.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>

                  {/* NAME + ROLE — desktop only */}
                  {user && (
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <p className="text-sm font-medium truncate max-w-20">
                        {user.name.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Member
                      </p>
                    </div>
                  )}

                  <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2">
                {user ? (
                  <>
                    {/* USER CARD */}
                    <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5 mb-1">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold [@media(min-width:375px)]:mr-8">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <Badge className="mt-1 bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0 h-3.5">
                          Member
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-sm"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      View Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-sm"
                      onClick={() => router.push("/dashboard/settings")}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="bg-destructive cursor-pointer gap-2 text-sm text-white focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-600 dark:focus:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-2 py-2 mb-1">
                      <p className="text-sm font-medium">Not signed in</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sign in to access your dashboard
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-sm text-indigo-600 focus:text-indigo-600"
                      onClick={handleLogin}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* MOBILE SEARCH BAR — slides down when toggled */}
        {searchOpen && (
          <div className="md:hidden border-t px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                autoFocus
                placeholder="Search users, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full rounded-lg border bg-muted/50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}