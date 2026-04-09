import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 10000;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// ✅ keep-alive ping every 14 minutes — prevents Render free tier sleep
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await fetch(`https://adminhub-ea0f.onrender.com/health`);
      console.log("🏓 Keep-alive ping sent");
    } catch {
      console.log("⚠️ Keep-alive ping failed");
    }
  }, 14 * 60 * 1000);
}

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("🔌 Server closed");
    process.exit(0);
  });
});