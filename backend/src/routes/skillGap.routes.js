import { Router } from "express";

import {
  deleteSkillGapAnalysis,
  generateSkillGapAnalysis,
  getLatestSkillGapAnalysis,
  getMySkillGapAnalyses,
  getSkillGapAnalysisById,
} from "../controllers/skillGap.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { withAiRequestLock } from "../utils/aiRequestLock.js";
import { aiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(protect);

router.post(
  "/generate",
  aiLimiter,
  withAiRequestLock("skill_gap_generation"),
  generateSkillGapAnalysis
);
router.get("/analyze", getLatestSkillGapAnalysis);
router.get("/my-analyses", getMySkillGapAnalyses);
router.get("/:id", getSkillGapAnalysisById);
router.delete("/:id", deleteSkillGapAnalysis);

export default router;