import express from "express";
import passport from "../../config/passport";

import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  forgotPassword,
  resetPassword,
} from "./auth.controller";

import { oauthCallback, oauthFailure } from "./oauth.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate";
import { upload } from "../../middlewares/upload.middleware";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../validators/auth.validator";

const router = express.Router();

// ── EMAIL / PASSWORD ───────────────────────────────────────
router.post("/register", validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, validate({ body: updateProfileSchema }), updateProfile);
router.put("/change-password", authenticate, validate({ body: changePasswordSchema }), changePassword);
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

// ── FORGOT / RESET PASSWORD ────────────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── GOOGLE OAUTH ───────────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  oauthCallback
);

// ── GITHUB OAUTH ───────────────────────────────────────────
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  oauthCallback
);

// ── OAUTH FAILURE ──────────────────────────────────────────
router.get("/oauth/failure", oauthFailure);

export default router;