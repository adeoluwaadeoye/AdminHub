import rateLimit from "express-rate-limit";

// Prevent brute force + abuse
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down",
});