"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/dashboard/skeletons/TableSkeleton";
import { toast } from "sonner";
import {
  Search, Trash2, Shield, ShieldOff,
  Users, CheckCircle2, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";

// ✅ proper types — no any
type UserRole = "user" | "admin";

type AdminUser = {
  _id:       string;
  name:      string;
  email:     string;
  role:      UserRole;
  createdAt: string;
  avatar?:   string;
};

type TaskStatusStat = {
  _id:   string;
  count: number;
};

type Stats = {
  totalUsers:    number;
  totalTasks:    number;
  tasksByStatus: TaskStatusStat[];
};

type UsersResponse = {
  users:      AdminUser[];
  totalPages: number;
};

export default function AdminPage() {
  const currentUser = useAuthStore((s) => s.user);

  const [users,      setUsers]      = useState<AdminUser[]>([]);
  const [stats,      setStats]      = useState<Stats | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionId,   setActionId]   = useState<string | null>(null);

  const LIMIT = 8;

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest<Stats>("/admin/stats");
      setStats(data);
    } catch {
      toast.error("Failed to load stats.");
    }
  }, []);

  // ✅ wrapped in useCallback so it can be added to useEffect deps
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
      });
      const data = await apiRequest<UsersResponse>(`/admin/users?${params}`);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ✅ fetchUsers now in deps array
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleToggle = async (user: AdminUser) => {
    setActionId(user._id);
    const newRole: UserRole = user.role === "admin" ? "user" : "admin";
    try {
      await apiRequest(`/admin/users/${user._id}`, {
        method: "PUT",
        body:   JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, role: newRole } : u)
      );
      toast.success(`${user.name} is now ${newRole}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update role.";
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete ${user.name}? This also deletes all their tasks.`)) return;
    setActionId(user._id);
    try {
      await apiRequest(`/admin/users/${user._id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`${user.name} deleted.`);
      fetchStats();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete user.";
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const doneTasks =
    stats?.tasksByStatus.find((s) => s._id === "done")?.count || 0;

  // ✅ proper type for currentUser id check
  const currentUserId = (currentUser as AdminUser | null)?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users and view platform statistics
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers ?? "—",
            icon:  <Users className="h-5 w-5 text-indigo-500" />,
            color: "bg-indigo-50 dark:bg-indigo-950",
          },
          {
            label: "Total Tasks",
            value: stats?.totalTasks ?? "—",
            icon:  <CheckCircle2 className="h-5 w-5 text-green-500" />,
            color: "bg-green-50 dark:bg-green-950",
          },
          {
            label: "Tasks Done",
            value: doneTasks,
            icon:  <CheckCircle2 className="h-5 w-5 text-purple-500" />,
            color: "bg-purple-50 dark:bg-purple-950",
          },
        ].map((s, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 flex items-center justify-center rounded-xl ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* USER TABLE */}
      <Card className="shadow-sm">
        <CardContent className="p-5">

          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="font-semibold">All Users</p>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-9 text-sm focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={LIMIT} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-muted/30 transition-colors">

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                {getInitials(u.name)}
                              </div>
                              <p className="font-medium truncate max-w-28">{u.name}</p>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-muted-foreground truncate max-w-40">
                            {u.email}
                          </td>

                          <td className="px-4 py-3">
                            <Badge className={
                              u.role === "admin"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-gray-100 text-gray-600"
                            }>
                              {u.role}
                            </Badge>
                          </td>

                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {u._id !== currentUserId && (
                                <>
                                  <button
                                    onClick={() => handleRoleToggle(u)}
                                    disabled={actionId === u._id}
                                    title={u.role === "admin" ? "Remove admin" : "Make admin"}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                                  >
                                    {actionId === u._id
                                      ? <Loader2  className="h-4 w-4 animate-spin" />
                                      : u.role === "admin"
                                        ? <ShieldOff className="h-4 w-4 text-muted-foreground" />
                                        : <Shield    className="h-4 w-4 text-indigo-500" />
                                    }
                                  </button>

                                  <button
                                    onClick={() => handleDelete(u)}
                                    disabled={actionId === u._id}
                                    title="Delete user"
                                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <p>Page {page} of {totalPages || 1}</p>
                <div className="flex gap-1">
                  <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
}