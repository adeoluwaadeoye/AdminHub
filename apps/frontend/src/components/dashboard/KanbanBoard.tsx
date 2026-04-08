"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutList,
  Plus,
  GripVertical,
  X,
} from "lucide-react";

type Priority = "low" | "medium" | "high";
type Column   = "todo" | "inprogress" | "done";

type Task = {
  id: number;
  title: string;
  priority: Priority;
};

type Board = Record<Column, Task[]>;

const priorityStyles: Record<Priority, string> = {
  low:    "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high:   "bg-red-100 text-red-600",
};

const columnMeta: Record<Column, { label: string; color: string }> = {
  todo:       { label: "To Do",       color: "bg-gray-100 text-gray-700" },
  inprogress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  done:       { label: "Done",        color: "bg-green-100 text-green-700" },
};

const initialBoard: Board = {
  todo: [
    { id: 1, title: "Design login page",       priority: "high" },
    { id: 2, title: "Write API documentation", priority: "medium" },
    { id: 3, title: "Set up CI/CD pipeline",   priority: "low" },
  ],
  inprogress: [
    { id: 4, title: "Build dashboard layout",  priority: "high" },
    { id: 5, title: "Integrate Recharts",      priority: "medium" },
  ],
  done: [
    { id: 6, title: "Set up Next.js project",  priority: "low" },
    { id: 7, title: "Configure Tailwind CSS",  priority: "low" },
  ],
};

let nextId = 8;

export default function KanbanBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [dragging, setDragging] = useState<{ task: Task; from: Column } | null>(null);
  const [adding, setAdding] = useState<Column | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // ── DRAG ──────────────────────────────────────────────────
  const onDragStart = (task: Task, from: Column) =>
    setDragging({ task, from });

  const onDrop = (to: Column) => {
    if (!dragging || dragging.from === to) return;

    setBoard((prev) => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter((t) => t.id !== dragging.task.id),
      [to]: [...prev[to], dragging.task],
    }));
    setDragging(null);
  };

  // ── ADD TASK ──────────────────────────────────────────────
  const addTask = (col: Column) => {
    if (!newTitle.trim()) return;
    setBoard((prev) => ({
      ...prev,
      [col]: [...prev[col], { id: nextId++, title: newTitle.trim(), priority: "medium" }],
    }));
    setNewTitle("");
    setAdding(null);
  };

  // ── DELETE ────────────────────────────────────────────────
  const deleteTask = (col: Column, id: number) =>
    setBoard((prev) => ({
      ...prev,
      [col]: prev[col].filter((t) => t.id !== id),
    }));

  const columns: Column[] = ["todo", "inprogress", "done"];

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-5">
          <LayoutList className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold text-base">Kanban Board</p>
            <p className="text-xs text-muted-foreground">
              Drag tasks between columns
            </p>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const meta = columnMeta[col];
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(col)}
                className="flex flex-col gap-2 rounded-xl bg-muted/40 p-3 min-h-48"
              >
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[11px] px-2 py-0 ${meta.color}`}>
                      {meta.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {board[col].length}
                    </span>
                  </div>

                  <button
                    onClick={() => { setAdding(col); setNewTitle(""); }}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* TASKS */}
                {board[col].map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => onDragStart(task, col)}
                    className="flex items-start gap-2 bg-background rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing group"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{task.title}</p>
                      <Badge className={`mt-1.5 text-[10px] px-1.5 py-0 ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </Badge>
                    </div>

                    <button
                      onClick={() => deleteTask(col, task.id)}
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}

                {/* ADD INPUT */}
                {adding === col && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <Input
                      autoFocus
                      placeholder="Task title..."
                      value={newTitle}
                      className="h-8 text-sm focus-visible:ring-0"
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask(col);
                        if (e.key === "Escape") setAdding(null);
                      }}
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs flex-1"
                        onClick={() => addTask(col)}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setAdding(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}