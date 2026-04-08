import { apiRequest } from "@/lib/api";
import { TaskStatus } from "@/types/task";

type Priority = "low" | "medium" | "high"; // ✅ added

type TaskResponse = {
  _id:         string;
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    Priority;      // ✅ was string — now matches FullTask
  dueDate:     string | null;
  tags:        string[];
  comments:    { _id: string; text: string; createdAt: string }[];
  createdAt:   string;
  updatedAt:   string;
};

type TasksResponse = {
  tasks:      TaskResponse[];
  total:      number;
  page:       number;
  totalPages: number;
};

type StatsResponse = {
  total:      number;
  completion: number;
  byStatus:   { _id: string; count: number }[];
  byPriority: { _id: string; count: number }[];
  dueSoon:    TaskResponse[];
  recent:     TaskResponse[];
};

type DeleteResponse = {
  message: string;
};

export const taskApi = {

  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiRequest<TasksResponse>(`/tasks${query}`);
  },

  getById: (id: string) =>
    apiRequest<TaskResponse>(`/tasks/${id}`),

  create: (data: {
    title:        string;
    description?: string;
    priority?:    Priority;   // ✅ was string
    dueDate?:     string | null;
    tags?:        string[];
  }) =>
    apiRequest<TaskResponse>("/tasks", {
      method: "POST",
      body:   JSON.stringify(data),
    }),

  update: (id: string, data: {
    title?:       string;
    description?: string;
    status?:      TaskStatus;
    priority?:    Priority;   // ✅ was string
    dueDate?:     string | null;
    tags?:        string[];
  }) =>
    apiRequest<TaskResponse>(`/tasks/${id}`, {
      method: "PUT",
      body:   JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<DeleteResponse>(`/tasks/${id}`, { method: "DELETE" }),

  getStats: () =>
    apiRequest<StatsResponse>("/tasks/stats"),

  addComment: (taskId: string, text: string) =>
    apiRequest<TaskResponse>(`/tasks/${taskId}/comments`, {
      method: "POST",
      body:   JSON.stringify({ text }),
    }),

  deleteComment: (taskId: string, commentId: string) =>
    apiRequest<TaskResponse>(`/tasks/${taskId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};