import { Router } from "express";

import {
  completeMockInterview,
  deleteMockInterview,
  getLatestMockInterview,
  getMockInterviewById,
  getMockInterviewStats,
  getMyMockInterviews,
  startMockInterview,
  submitInterviewAnswer,
} from "../controllers/interview.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { withAiRequestLock } from "../utils/aiRequestLock.js";

const router = Router();

router.use(protect);

router.get("/stats/summary", getMockInterviewStats);

router.post(
  "/start",
  withAiRequestLock("interview_generation"),
  startMockInterview
);
router.get("/my-interviews", getMyMockInterviews);
router.get("/latest", getLatestMockInterview);
router.get("/:id", getMockInterviewById);
router.post(
  "/:id/answer",
  withAiRequestLock("interview_answer_evaluation"),
  submitInterviewAnswer
);
router.post(
  "/:id/complete",
  withAiRequestLock("interview_summary_generation"),
  completeMockInterview
);
router.delete("/:id", deleteMockInterview);

export default router;