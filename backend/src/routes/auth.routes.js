import { Router } from "express";

import { getCurrentUser, loginUser,logoutUser,registerUser, updateUserProfile} from "../controllers/Auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser)
router.get("/update-profile", protect , updateUserProfile)

export default router;
