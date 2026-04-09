"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { taskApi } from "@/lib/taskApi";
import { Task, TaskStatus } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, Check, X,
  Loader2, ClipboardList, Lock,
} from "lucide-react";
import Link from "next/link";

// ✅ FullTask defined here — no duplicate import
type FullTask = Task & {
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  tags: string[];
  comments: { _id: string; text: string; createdAt: string }[];
};

const statusStyles: Record<TaskStatus, string> = {
  "todo": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "done": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const statusCycle: Record<TaskStatus, TaskStatus> = {
  "todo": "in-progress",
  "in-progress": "done",
  "done": "todo",
};

const statusLabel: Record<TaskStatus, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

export default function TaskDemo() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  const [tasks, setTasks] = useState<FullTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── FETCH ─────────────────────────────────────────────
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getAll();
      setTasks(data.tasks as FullTask[]); // ✅ fixed — was data directly
    } catch {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  // ── CREATE ────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    setCreating(true);
    try {
      const task = await taskApi.create({
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      setTasks((prev) => [task as FullTask, ...prev]);
      setNewTitle("");
      setNewDesc("");
      toast.success("Task created!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create task.";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // ── UPDATE STATUS ─────────────────────────────────────
  const handleStatusCycle = async (task: FullTask) => {
    const nextStatus = statusCycle[task.status];
    try {
      const updated = await taskApi.update(task._id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? (updated as FullTask) : t))
      );
      toast.success(`Status → ${statusLabel[nextStatus]}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // ── EDIT SAVE ─────────────────────────────────────────
  const handleEditSave = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      const updated = await taskApi.update(id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? (updated as FullTask) : t))
      );
      setEditId(null);
      toast.success("Task updated!");
    } catch {
      toast.error("Failed to update task.");
    }
  };

  // ── DELETE ────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted.");
    } catch {
      toast.error("Failed to delete task.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── COUNTS ────────────────────────────────────────────
  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  // ── NOT LOGGED IN ─────────────────────────────────────
  if (initialized && !user) {
    return (
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950 mb-4">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Sign in to manage your tasks
          </h2>
          <p className="text-muted-foreground mb-6">
            Create an account to start creating, tracking, and completing
            tasks in real time.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/auth/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">

        {/* SECTION HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 mb-3">
            <ClipboardList className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Your Task Board</h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Powered by your Express backend — live CRUD operations
          </p>
        </div>

        {/* STAT PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: counts.total, color: "bg-background border" },
            { label: "To Do", value: counts.todo, color: "bg-gray-100 dark:bg-gray-800" },
            { label: "In Progress", value: counts.inProgress, color: "bg-yellow-50 dark:bg-yellow-900/30" },
            { label: "Done", value: counts.done, color: "bg-green-50 dark:bg-green-900/30" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CREATE FORM */}
        <Card className="mb-6 shadow-sm border-indigo-100 dark:border-indigo-900">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              New Task
            </p>
            <Input
              placeholder="Task title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="focus-visible:ring-indigo-500"
            />
            <Input
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="focus-visible:ring-indigo-500"
            />
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {creating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                : <><Plus className="h-4 w-4" /> Add Task</>
              }
            </Button>
          </CardContent>
        </Card>

        {/* TASK LIST */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className={`shadow-sm transition-all duration-200 ${task.status === "done" ? "opacity-60" : ""
                  }`}
              >
                <CardContent className="p-4">
                  {editId === task._id ? (
                    /* ── EDIT MODE ── */
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="focus-visible:ring-indigo-500"
                      />
                      <Input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="focus-visible:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => handleEditSave(task._id)}
                        >
                          <Check className="h-3.5 w-3.5" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => setEditId(null)}
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <div className="flex items-start gap-3">

                      {/* STATUS BADGE */}
                      <button
                        onClick={() => handleStatusCycle(task)}
                        title="Click to change status"
                        className="mt-0.5 shrink-0"
                      >
                        <Badge className={`text-[11px] px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity ${statusStyles[task.status]}`}>
                          {statusLabel[task.status]}
                        </Badge>
                      </button>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug ${task.status === "done"
                          ? "line-through text-muted-foreground"
                          : ""
                          }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {task.description}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(task.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-1 shrink-0 cursor-pointer">
                        <button
                          onClick={() => {
                            setEditId(task._id);
                            setEditTitle(task.title);
                            setEditDesc(task.description);
                          }}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-50 cursor-pointer dark:hover:bg-red-950 transition-colors"
                        >
                          {deletingId === task._id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                            : <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}