import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import passport from "./config/passport";
import authRoutes   from "./modules/auth/auth.routes";
import taskRoutes   from "./modules/tasks/task.routes";
import adminRoutes  from "./modules/admin/admin.routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// ── SECURITY ───────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ── BODY + COOKIES ─────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── PASSPORT — must be before routes ──────────────────────
app.use(passport.initialize());

// ── RATE LIMITING ──────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      100,
  })
);

// ── STATIC FILES ───────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── ROUTES ─────────────────────────────────────────────────
app.use("/api/auth",   authRoutes);
app.use("/api/tasks",  taskRoutes);
app.use("/api/admin",  adminRoutes);
app.use("/health",     healthRoutes);

// ── ERROR HANDLER — must be last ───────────────────────────
app.use(errorHandler);

export default app;