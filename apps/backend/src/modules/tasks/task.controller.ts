import { Response } from "express";
import { Task } from "./task.model";
import { AuthRequest } from "../../middlewares/auth.middleware";

// ✅ single helper — throws early if user is missing
const getUserId = (req: AuthRequest): string => {
  if (!req.user?.id) throw new Error("Unauthorized");
  return req.user.id;
};

// ── CREATE ─────────────────────────────────────────────────
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title, description, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags:    tags || [],
      user:    userId,
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET ALL — with search & filter ────────────────────────
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);

    const {
      search,
      status,
      priority,
      tag,
      sortBy = "createdAt",
      order  = "desc",
      page   = "1",
      limit  = "20",
    } = req.query as Record<string, string>;

    const query: Record<string, any> = { user: userId };

    if (search)   query.$text    = { $search: search };
    if (status)   query.status   = status;
    if (priority) query.priority = priority;
    if (tag)      query.tags     = { $in: [tag] };

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const sort  = { [sortBy]: order === "asc" ? 1 : -1 } as Record<string, 1 | -1>;
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks,
      total,
      page:       parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE ─────────────────────────────────────────────
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);

    const task = await Task.findOne({
      _id:  req.params.id,
      user: userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ─────────────────────────────────────────────────
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);

    const task = await Task.findOneAndDelete({
      _id:  req.params.id,
      user: userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── ADD COMMENT ────────────────────────────────────────────
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $push: { comments: { text: text.trim() } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE COMMENT ─────────────────────────────────────────
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── STATS & ANALYTICS ──────────────────────────────────────
export const getTaskStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);

    const [statusStats, priorityStats, dueSoonTasks, recentTasks] =
      await Promise.all([

        Task.aggregate([
          { $match: { user: userId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Task.aggregate([
          { $match: { user: userId } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),

        Task.find({
          user:    userId,
          status:  { $ne: "done" },
          dueDate: {
            $gte: new Date(),
            $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        }).sort({ dueDate: 1 }).limit(5),

        Task.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const total      = await Task.countDocuments({ user: userId });
    const totalDone  = statusStats.find((s) => s._id === "done")?.count || 0;
    const completion = total > 0 ? Math.round((totalDone / total) * 100) : 0;

    res.json({
      total,
      completion,
      byStatus:   statusStats,
      byPriority: priorityStats,
      dueSoon:    dueSoonTasks,
      recent:     recentTasks,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};