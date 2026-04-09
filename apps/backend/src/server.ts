import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 10000;

// ✅ validate env early
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// ✅ start server FIRST so Render detects open port immediately
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ then connect to MongoDB
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

// ✅ graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("🔌 Server closed");
    process.exit(0);
  });
});