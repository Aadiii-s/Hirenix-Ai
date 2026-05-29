import { Router } from "express";

import {
  deleteRoadmap,
  generateRoadmap,
  getLatestRoadmap,
  getMyRoadmaps,
  getRoadmapById,
  toggleRoadmapDayCompletion,
} from "../controllers/roadmap.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/generate", generateRoadmap);
router.get("/my-roadmaps", getMyRoadmaps);
router.get("/latest", getLatestRoadmap);
router.patch("/:id/toggle-day", toggleRoadmapDayCompletion);
router.get("/:id", getRoadmapById);
router.delete("/:id", deleteRoadmap);

export default router;