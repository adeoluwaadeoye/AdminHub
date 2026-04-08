import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  getTaskStats,
} from "./task.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate }     from "../../middlewares/validate";

// ✅ import only from task.validator — not auth.validator
import {
  createTaskSchema,
  updateTaskSchema,
  commentSchema,
} from "../../validators/task.validator";

const router = express.Router();

// ── STATS
router.get("/stats", authenticate, getTaskStats);

// ── CRUD
router.post(  "/",    authenticate, validate({ body: createTaskSchema }), createTask);
router.get(   "/",    authenticate, getTasks);
router.get(   "/:id", authenticate, getTaskById);
router.put(   "/:id", authenticate, validate({ body: updateTaskSchema }), updateTask);
router.delete("/:id", authenticate, deleteTask);

// ── COMMENTS
router.post(  "/:id/comments",            authenticate, validate({ body: commentSchema }), addComment);
router.delete("/:id/comments/:commentId", authenticate, deleteComment);

export default router;