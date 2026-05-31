import { Router } from "express";

import {
  deleteSkillGapAnalysis,
  generateSkillGapAnalysis,
  getLatestSkillGapAnalysis,
  getMySkillGapAnalyses,
  getSkillGapAnalysisById,
} from "../controllers/sillGap.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/generate", generateSkillGapAnalysis);
router.get("/analyze", getLatestSkillGapAnalysis);
router.get("/my-analyses", getMySkillGapAnalyses);
router.get("/:id", getSkillGapAnalysisById);
router.delete("/:id", deleteSkillGapAnalysis);

export default router;