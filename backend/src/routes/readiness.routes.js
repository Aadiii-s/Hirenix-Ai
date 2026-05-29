import { Router } from "express";

import { getPlacementReadinessScore } from "../controllers/readiness.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/score", getPlacementReadinessScore);

export default router;