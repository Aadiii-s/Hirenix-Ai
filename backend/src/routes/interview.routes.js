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

const router = Router();

router.use(protect);

router.get("/stats/summary", getMockInterviewStats);

router.post("/start", startMockInterview);
router.get("/my-interviews", getMyMockInterviews);
router.get("/latest", getLatestMockInterview);
router.get("/:id", getMockInterviewById);
router.post("/:id/answer", submitInterviewAnswer);
router.post("/:id/complete", completeMockInterview);
router.delete("/:id", deleteMockInterview);

export default router;