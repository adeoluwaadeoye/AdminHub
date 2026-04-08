import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/tasks/task.routes";
import healthRoutes from "./routes/health.routes";

import { errorHandler } from "./middlewares/error.middleware";

import adminRoutes from "./modules/admin/admin.routes";
import path from "path";

import passport from "./config/passport";


const app = express();

/**
 * 🔐 Security headers
 */
app.use(helmet());

/**
 * 🌐 CORS (required for cookies)
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/**
 * 📦 Body + cookies
 */
app.use(express.json());
app.use(cookieParser());

/**
 * 🚦 Rate limiting
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/**
 * 📍 Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/health", healthRoutes);

/**
 * ❌ Error handler MUST be last
 */
app.use(errorHandler);

// existing routes...
app.use("/api/auth",  authRoutes);
app.use("/api/tasks", taskRoutes);

//NEW
app.use("/api/admin", adminRoutes);

//serve uploaded avatars as static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(passport.initialize());


export default app;