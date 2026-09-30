import { Router } from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",authLimiter, registerUser);
router.post("/login",authLimiter, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateUserProfile);

export default router;