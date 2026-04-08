import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};