import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./auth.model";
import { redis } from "../../config/redis";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.utils";

// Register
export const registerUser = async (email: string, password: string) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashed,
    role: "user",
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redis.set(`refresh:${user._id}`, refreshToken);

  return { userId: user._id, accessToken, refreshToken };
};

// Login
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redis.set(`refresh:${user._id}`, refreshToken);

  return { userId: user._id, accessToken, refreshToken };
};

// Refresh rotation + Redis validation
export const refreshTokenService = async (token: string) => {
  if (!token) throw new Error("Missing refresh token");

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { userId: string };

  const stored = await redis.get(`refresh:${decoded.userId}`);

  if (!stored || stored !== token) {
    throw new Error("Invalid session");
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error("User not found");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await redis.set(`refresh:${user._id}`, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Logout (session invalidation)
export const logoutService = async (userId: string) => {
  await redis.del(`refresh:${userId}`);
  return { message: "Logged out successfully" };
};