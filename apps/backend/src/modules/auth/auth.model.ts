import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name:                string;
  email:               string;
  password:            string;
  role:                "user" | "admin";
  avatar:              string;
  provider:            "local" | "google" | "github";
  resetPasswordToken?: string;  
  resetPasswordExpiry?: Date;   
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
    },
    password: {
      type:     String,
      required: true,
      select:   false,
    },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    avatar: {
      type:    String,
      default: "",
    },
    provider: {
      type:    String,
      enum:    ["local", "google", "github"],
      default: "local",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);