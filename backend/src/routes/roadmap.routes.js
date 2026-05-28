import { Router } from "express";

import {
  deleteRoadmap,
  generateRoadmap,
  getMyRoadmaps,
  getRoadmapById,
} from "../controllers/roadmap.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/generate", generateRoadmap);
router.get("/my-roadmaps", getMyRoadmaps);
router.get("/:id", getRoadmapById);
router.delete("/:id", deleteRoadmap);

export default router;