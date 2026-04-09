import { Request, Response } from "express";
import { User } from "./auth.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetEmail, sendWelcomeEmail } from "../../lib/mailer";

// ── HELPER ─────────────────────────────────────────────────
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};

// ✅ httpOnly cookie — secure, not readable by JS
const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none" | "lax" | "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

// ✅ public cookie — readable by Next.js middleware for route protection
const publicCookieOptions = {
  httpOnly: false,
  secure:   process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none" | "lax" | "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

// ── REGISTER ───────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });
    const token  = generateToken(user);

    // ✅ set both cookies
    res.cookie("token",       token, cookieOptions);
    res.cookie("auth-status", "1",   publicCookieOptions);

    sendWelcomeEmail(email, name).catch((err: Error) =>
      console.error("Welcome email failed:", err.message)
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── LOGIN ──────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // ✅ set both cookies
    res.cookie("token",       token, cookieOptions);
    res.cookie("auth-status", "1",   publicCookieOptions);

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── LOGOUT ─────────────────────────────────────────────────
export const logout = (_req: Request, res: Response) => {
  // ✅ clear both cookies on logout
  res.clearCookie("token", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
      | "none" | "lax" | "strict",
  });
  res.clearCookie("auth-status", {
    httpOnly: false,
    secure:   process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
      | "none" | "lax" | "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// ── GET CURRENT USER ───────────────────────────────────────
export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── UPDATE PROFILE ─────────────────────────────────────────
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = req.user?.id;

    if (email) {
      const existing = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── CHANGE PASSWORD ────────────────────────────────────────
export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── UPLOAD AVATAR ──────────────────────────────────────────
export const uploadAvatar = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    res.json({ user, avatarUrl });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── FORGOT PASSWORD ────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken  = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    await sendResetEmail(email, token);

    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── RESET PASSWORD ─────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken:  token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    user.password            = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};