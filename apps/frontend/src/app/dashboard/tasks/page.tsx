"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { taskApi } from "@/lib/taskApi";
import { Task, TaskStatus } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TaskSkeleton } from "@/components/dashboard/skeletons/TaskSkeleton";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, Check, X,
  Loader2, Search, Filter, MessageSquare,
  Calendar, Tag, ChevronDown, ChevronUp,
  ClipboardList, AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ── TYPES ──────────────────────────────────────────────────
type Priority = "low" | "medium" | "high";

type Comment = {
  _id: string;
  text: string;
  createdAt: string;
};

type FullTask = Task & {
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  comments: Comment[];
};

// ── STYLE MAPS ─────────────────────────────────────────────
const statusStyles: Record<TaskStatus, string> = {
  "todo": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "done": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const priorityStyles: Record<Priority, string> = {
  low: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  medium: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  high: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
};

const statusCycle: Record<TaskStatus, TaskStatus> = {
  "todo": "in-progress", "in-progress": "done", "done": "todo",
};

const statusLabel: Record<TaskStatus, string> = {
  "todo": "To Do", "in-progress": "In Progress", "done": "Done",
};

// ── EMPTY STATE ────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
      <p className="text-sm font-medium">
        {filtered ? "No tasks match your filters." : "No tasks yet."}
      </p>
      <p className="text-xs mt-1">
        {filtered
          ? "Try adjusting your search or filters."
          : "Create your first task above."}
      </p>
    </div>
  );
}

// ── COMMENT SECTION ────────────────────────────────────────
function CommentSection({
  taskId, comments, onUpdate,
}: {
  taskId: string;
  comments: Comment[];
  onUpdate: (updated: FullTask) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const updated = await taskApi.addComment(taskId, text.trim());
      onUpdate(updated as FullTask);
      setText("");
    } catch {
      toast.error("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const updated = await taskApi.deleteComment(taskId, commentId);
      onUpdate(updated as FullTask);
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="mt-3 pt-3 border-t space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Comments ({comments.length})
      </p>

      {comments.map((c) => (
        <div key={c._id} className="flex items-start gap-2 group">
          <div className="flex-1 bg-muted/40 rounded-lg px-3 py-2">
            <p className="text-xs">{c.text}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {new Date(c.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={() => handleDelete(c._id)}
            className="opacity-0 group-hover:opacity-100 transition mt-1"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-8 text-xs focus-visible:ring-indigo-500"
        />
        <Button
          size="sm"
          className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAdd}
          disabled={loading || !text.trim()}
        >
          {loading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Plus className="h-3.5 w-3.5" />
          }
        </Button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────
export default function TasksPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  // ✅ client-side auth guard
  useEffect(() => {
    if (initialized && !user) {
      window.location.href = "/auth/login";
    }
  }, [user, initialized]);

  const [tasks, setTasks] = useState<FullTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandId, setExpandId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");

  const [newTask, setNewTask] = useState({
    title: "", description: "", priority: "medium" as Priority,
    dueDate: "", tags: "",
  });

  const [editForm, setEditForm] = useState({
    title: "", description: "", priority: "medium" as Priority,
    dueDate: "", tags: "", status: "todo" as TaskStatus,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 10;

  // ── FETCH ──────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(LIMIT),
        sortBy,
        order: "desc",
      };
      if (search) params.search = search;
      if (status !== "all") params.status = status;
      if (priority !== "all") params.priority = priority;

      const data = await taskApi.getAll(params);
      setTasks(data.tasks as FullTask[]);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, sortBy]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── CREATE ─────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newTask.title.trim()) { toast.error("Title is required."); return; }
    setCreating(true);
    try {
      await taskApi.create({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        tags: newTask.tags
          ? newTask.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "", tags: "" });
      toast.success("Task created!");
      fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create task.";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // ── STATUS CYCLE ───────────────────────────────────────
  const handleStatusCycle = async (task: FullTask) => {
    try {
      const updated = await taskApi.update(task._id, {
        status: statusCycle[task.status],
      });
      setTasks((prev) =>
        prev.map((t) => t._id === updated._id ? { ...t, ...updated } : t)
      );
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // ── EDIT SAVE ──────────────────────────────────────────
  const handleEditSave = async (id: string) => {
    if (!editForm.title.trim()) { toast.error("Title is required."); return; }
    try {
      const updated = await taskApi.update(id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        status: editForm.status,
        priority: editForm.priority,
        dueDate: editForm.dueDate || null,
        tags: editForm.tags
          ? editForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
      setTasks((prev) =>
        prev.map((t) => t._id === updated._id ? { ...t, ...updated } : t)
      );
      setEditId(null);
      toast.success("Task updated!");
    } catch {
      toast.error("Failed to update task.");
    }
  };

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setTotal((p) => p - 1);
      toast.success("Task deleted.");
    } catch {
      toast.error("Failed to delete task.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── COMMENT UPDATE ──────────────────────────────────────
  const handleCommentUpdate = (updated: FullTask) => {
    setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
  };

  const hasFilters = search || status !== "all" || priority !== "all";

  // ✅ show loading while auth initializes
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} task{total !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* CREATE FORM */}
      <Card className="shadow-sm border-indigo-100 dark:border-indigo-900">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            New Task
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Task title *"
              value={newTask.title}
              onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="focus-visible:ring-indigo-500"
            />
            <Input
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
              className="focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, priority: e.target.value as Priority }))
                }
                className="w-full h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
                className="h-9 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Tags (comma separated)
              </Label>
              <Input
                placeholder="design, backend, urgent"
                value={newTask.tags}
                onChange={(e) => setNewTask((p) => ({ ...p, tags: e.target.value }))}
                className="h-9 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {creating
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
              : <><Plus className="h-4 w-4" /> Add Task</>
            }
          </Button>
        </CardContent>
      </Card>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-2">

        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 focus-visible:ring-indigo-500"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Filter className="h-3.5 w-3.5" />
              {status === "all" ? "Status" : statusLabel[status as TaskStatus]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setStatus("all"); setPage(1); }}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {(["todo", "in-progress", "done"] as TaskStatus[]).map((s) => (
              <DropdownMenuItem key={s} onClick={() => { setStatus(s); setPage(1); }}>
                {statusLabel[s]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <AlertCircle className="h-3.5 w-3.5" />
              {priority === "all" ? "Priority" : priority}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setPriority("all"); setPage(1); }}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <DropdownMenuItem
                key={p}
                onClick={() => { setPriority(p); setPage(1); }}
                className="capitalize"
              >
                {p}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              Sort: {
                sortBy === "createdAt" ? "Newest" :
                  sortBy === "dueDate" ? "Due Date" : "Priority"
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("createdAt")}>Newest</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("dueDate")}>Due Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground"
            onClick={() => {
              setSearch(""); setStatus("all"); setPriority("all"); setPage(1);
            }}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* TASK LIST */}
      {loading ? (
        <TaskSkeleton count={5} />
      ) : tasks.length === 0 ? (
        <EmptyState filtered={!!hasFilters} />
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
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, title: e.target.value }))
                        }
                        className="focus-visible:ring-indigo-500"
                        placeholder="Title"
                      />
                      <Input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, description: e.target.value }))
                        }
                        className="focus-visible:ring-indigo-500"
                        placeholder="Description"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, status: e.target.value as TaskStatus }))
                        }
                        className="h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {(["todo", "in-progress", "done"] as TaskStatus[]).map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>

                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, priority: e.target.value as Priority }))
                        }
                        className="h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {(["low", "medium", "high"] as Priority[]).map((p) => (
                          <option key={p} value={p} className="capitalize">{p}</option>
                        ))}
                      </select>

                      <Input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, dueDate: e.target.value }))
                        }
                        className="h-9 focus-visible:ring-indigo-500"
                      />

                      <Input
                        placeholder="tag1, tag2"
                        value={editForm.tags}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, tags: e.target.value }))
                        }
                        className="h-9 focus-visible:ring-indigo-500"
                      />
                    </div>

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
                  <>
                    <div className="flex items-start gap-3">

                      <button
                        onClick={() => handleStatusCycle(task)}
                        title="Click to cycle status"
                        className="mt-0.5 shrink-0"
                      >
                        <Badge className={`text-[11px] px-2 py-0.5 cursor-pointer hover:opacity-80 ${statusStyles[task.status]}`}>
                          {statusLabel[task.status]}
                        </Badge>
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.status === "done"
                            ? "line-through text-muted-foreground"
                            : ""
                          }`}>
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge className={`text-[10px] px-1.5 py-0 ${priorityStyles[task.priority]}`}>
                            {task.priority}
                          </Badge>

                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </span>
                          )}

                          {task.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-0.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag}
                            </span>
                          ))}

                          {task.comments?.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {task.comments.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() =>
                            setExpandId(expandId === task._id ? null : task._id)
                          }
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        >
                          {expandId === task._id
                            ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                            : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          }
                        </button>

                        <button
                          onClick={() => {
                            setEditId(task._id);
                            setEditForm({
                              title: task.title,
                              description: task.description,
                              status: task.status,
                              priority: task.priority,
                              dueDate: task.dueDate
                                ? new Date(task.dueDate).toISOString().split("T")[0]
                                : "",
                              tags: task.tags?.join(", ") || "",
                            });
                          }}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingId === task._id}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          {deletingId === task._id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                            : <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          }
                        </button>
                      </div>
                    </div>

                    {expandId === task._id && (
                      <CommentSection
                        taskId={task._id}
                        comments={task.comments || []}
                        onUpdate={handleCommentUpdate}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
              <p>Page {page} of {totalPages}</p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}