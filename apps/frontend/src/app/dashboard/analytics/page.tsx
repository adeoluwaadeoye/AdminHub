"use client";

import { useEffect, useState } from "react";
import { taskApi } from "@/lib/taskApi";
import { Card, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "@/components/dashboard/skeletons/CardSkeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    ResponsiveContainer, BarChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, Legend,
    // ✅ removed unused AreaChart, Area
} from "recharts";
import {
    CheckCircle2, Clock, Loader2 as LoaderIcon,
    TrendingUp, ListTodo, AlertCircle,
} from "lucide-react";

// ✅ proper types replacing any[]
type TaskItem = {
    _id: string;
    title: string;
    status: string;
    dueDate: string | null; // ✅ matches TaskResponse
};

type Stats = {
    total: number;
    completion: number;
    byStatus: { _id: string; count: number }[];
    byPriority: { _id: string; count: number }[];
    dueSoon: TaskItem[];  // ✅ was any[]
    recent: TaskItem[];  // ✅ was any[]
};

const STATUS_COLORS: Record<string, string> = {
    "todo": "#94a3b8",
    "in-progress": "#f59e0b",
    "done": "#10b981",
};

const PRIORITY_COLORS: Record<string, string> = {
    low: "#6366f1",
    medium: "#f97316",
    high: "#ef4444",
};

const statusLabel: Record<string, string> = {
    "todo": "To Do", "in-progress": "In Progress", "done": "Done",
};

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await taskApi.getStats();
                setStats(data);
            } catch {
                toast.error("Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const statusData = stats.byStatus.map((s) => ({
        name: statusLabel[s._id] || s._id,
        value: s.count,
        color: STATUS_COLORS[s._id] || "#6366f1",
    }));

    const priorityData = stats.byPriority.map((p) => ({
        name: p._id,
        value: p.count,
        color: PRIORITY_COLORS[p._id] || "#6366f1",
    }));

    const done = stats.byStatus.find((s) => s._id === "done")?.count || 0;
    const inProgress = stats.byStatus.find((s) => s._id === "in-progress")?.count || 0;
    // ✅ removed unused `todo` variable

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Real data from your task history
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Tasks",
                        value: stats.total,
                        icon: <ListTodo className="h-5 w-5 text-indigo-500" />,
                        color: "bg-indigo-50 dark:bg-indigo-950",
                    },
                    {
                        label: "Completed",
                        value: done,
                        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                        color: "bg-green-50 dark:bg-green-950",
                    },
                    {
                        label: "In Progress",
                        value: inProgress,
                        icon: <LoaderIcon className="h-5 w-5 text-yellow-500" />,
                        color: "bg-yellow-50 dark:bg-yellow-950",
                    },
                    {
                        label: "Completion Rate",
                        value: `${stats.completion}%`,
                        icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
                        color: "bg-purple-50 dark:bg-purple-950",
                    },
                ].map((k, i) => (
                    <Card key={i} className="shadow-sm">
                        <CardContent className="p-5 flex items-center gap-4">
                            {/* ✅ flex-shrink-0 → shrink-0 */}
                            <div className={`h-11 w-11 flex items-center justify-center rounded-xl shrink-0 ${k.color}`}>
                                {k.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{k.value}</p>
                                <p className="text-xs text-muted-foreground">{k.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* COMPLETION PROGRESS */}
            <Card className="shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-sm">Overall Completion</p>
                        <span className="text-sm font-bold text-indigo-600">
                            {stats.completion}%
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                            style={{ width: `${stats.completion}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{done} done</span>
                        <span>{stats.total - done} remaining</span>
                    </div>
                </CardContent>
            </Card>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* STATUS PIE */}
                <Card className="shadow-sm">
                    <CardContent className="p-5">
                        <p className="font-semibold text-sm mb-4">Tasks by Status</p>
                        {statusData.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No data yet.
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {statusData.map((s, i) => (
                                            <Cell key={i} fill={s.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend
                                        formatter={(value) => (
                                            <span className="text-xs text-muted-foreground">{value}</span>
                                        )}
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* PRIORITY BAR */}
                <Card className="shadow-sm">
                    <CardContent className="p-5">
                        <p className="font-semibold text-sm mb-4">Tasks by Priority</p>
                        {priorityData.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No data yet.
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Tasks">
                                        {priorityData.map((p, i) => (
                                            <Cell key={i} fill={p.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* DUE SOON + RECENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* DUE SOON */}
                <Card className="shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <p className="font-semibold text-sm">Due in Next 3 Days</p>
                        </div>
                        {stats.dueSoon.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                                No tasks due soon. 🎉
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {/* ✅ t is now TaskItem — no any */}
                                {stats.dueSoon.map((t) => (
                                    <div
                                        key={t._id}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40"
                                    >
                                        <p className="text-sm truncate max-w-40">{t.title}</p>
                                        <span className="text-[10px] text-yellow-600 font-medium whitespace-nowrap">
                                            {t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric",
                                            }) : "—"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RECENTLY CREATED */}
                <Card className="shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-4 w-4 text-indigo-500" />
                            <p className="font-semibold text-sm">Recently Created</p>
                        </div>
                        {stats.recent.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                                No tasks created yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {/* ✅ t is now TaskItem — no any */}
                                {stats.recent.map((t) => (
                                    <div
                                        key={t._id}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40"
                                    >
                                        <p className="text-sm truncate max-w-40">{t.title}</p>
                                        <Badge className={`text-[10px] px-2 py-0 ${t.status === "done"
                                                ? "bg-green-100 text-green-700"
                                                : t.status === "in-progress"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {statusLabel[t.status]}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}