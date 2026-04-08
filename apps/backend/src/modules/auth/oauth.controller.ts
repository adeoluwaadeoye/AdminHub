import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (user: any) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const oauthCallback = (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   24 * 60 * 60 * 1000,
  });

  // ✅ redirect to dashboard after successful OAuth
  res.redirect(`${FRONTEND_URL}/dashboard`);
};

export const oauthFailure = (_req: Request, res: Response) => {
  res.redirect(`${FRONTEND_URL}/auth/login?error=oauth_failed`);
};