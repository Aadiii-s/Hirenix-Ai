import { Router } from "express";

import {
  analyzeResume,
  deleteResumeAnalysis,
  getMyResumeAnalyses,
  getResumeAnalysisById,
} from "../controllers/resume.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(protect);

router.post("/analyze", uploadResume.single("resume"), analyzeResume);
router.get("/my-analyses", getMyResumeAnalyses);
router.get("/:id", getResumeAnalysisById);
router.delete("/:id", deleteResumeAnalysis);

export default router;