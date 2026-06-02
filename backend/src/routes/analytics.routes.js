import { Router } from "express";

import { getAnalyticsOverview } from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/overview", getAnalyticsOverview);

export default router;