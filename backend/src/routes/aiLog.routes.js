import express from "express";
import {
  getMyAiRequestLogs,
  getMyAiRequestStats,
} from "../controllers/aiLog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyAiRequestLogs);
router.get("/stats", getMyAiRequestStats);

export default router;