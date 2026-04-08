import jwt from "jsonwebtoken";

export const signAccessToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);