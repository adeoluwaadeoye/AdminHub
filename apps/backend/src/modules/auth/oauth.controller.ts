import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (user: any) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ shared cookie options
const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none" | "lax" | "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

// ✅ public cookie — readable by Next.js middleware
const publicCookieOptions = {
  httpOnly: false,
  secure:   process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none" | "lax" | "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

export const oauthCallback = (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
  }

  const token = generateToken(user);

  // ✅ set both cookies — httpOnly for security, public for middleware
  res.cookie("token",       token, cookieOptions);
  res.cookie("auth-status", "1",   publicCookieOptions);

  res.redirect(`${FRONTEND_URL}/dashboard`);
};

export const oauthFailure = (_req: Request, res: Response) => {
  res.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
};