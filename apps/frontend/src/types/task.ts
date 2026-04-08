export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};