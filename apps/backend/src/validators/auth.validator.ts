import { z } from "zod";

/**
 * LOGIN VALIDATION
 */
export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});

/**
 * REGISTER VALIDATION
 */
export const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});


export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name too short").max(100).optional(),
  email: z.string().email("Invalid email").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});