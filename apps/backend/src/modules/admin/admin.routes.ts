import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getPlatformStats,
} from "./admin.controller";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware";

const router = express.Router();

// all admin routes require auth + admin role
router.use(authenticate, requireAdmin);

router.get(   "/stats",       getPlatformStats);
router.get(   "/users",       getAllUsers);
router.get(   "/users/:id",   getUserById);
router.put(   "/users/:id",   updateUserRole);
router.delete("/users/:id",   deleteUser);

export default router;