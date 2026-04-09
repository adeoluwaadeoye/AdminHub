import { Response } from "express";
import { User } from "../auth/auth.model";
import { Task } from "../tasks/task.model";
import { AuthRequest } from "../../middlewares/auth.middleware";

// ── GET ALL USERS ──────────────────────────────────────────
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", search } = req.query as Record<string, string>;

    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE USER ────────────────────────────────────────
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE USER ROLE ───────────────────────────────────────
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE USER ────────────────────────────────────────────
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // also delete their tasks
    await Task.deleteMany({ user: req.params.id });

    res.json({ message: "User and their tasks deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── PLATFORM STATS ─────────────────────────────────────────
export const getPlatformStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      totalUsers,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      recentUsers,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};