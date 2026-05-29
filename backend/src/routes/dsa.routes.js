import { Router } from "express";

import {
  createDsaQuestion,
  deleteDsaQuestion,
  getDsaQuestionById,
  getDsaStats,
  getMyDsaQuestions,
  updateDsaQuestion,
  updateDsaQuestionStatus,
} from "../controllers/dsa.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/stats", getDsaStats);

router.post("/questions", createDsaQuestion);
router.get("/questions", getMyDsaQuestions);
router.get("/questions/:id", getDsaQuestionById);
router.patch("/questions/:id/status", updateDsaQuestionStatus);
router.patch("/questions/:id", updateDsaQuestion);
router.delete("/questions/:id", deleteDsaQuestion);

export default router;