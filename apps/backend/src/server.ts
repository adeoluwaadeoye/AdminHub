import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

/**
 * 🔐 Validate env early
 */
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

/**
 * 🧠 Mongo connection options (stability + future-proofing)
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    /**
     * 🧯 Graceful shutdown
     */
    process.on("SIGINT", async () => {
      console.log("🛑 SIGINT received. Shutting down gracefully...");
      await mongoose.connection.close();
      server.close(() => {
        console.log("🔌 Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

connectDB();