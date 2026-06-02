import { Router } from "express";

import {
  createCompanyPrep,
  deleteCompanyPrep,
  getCompanyPrepById,
  getCompanyPrepStats,
  getMyCompanyPreps,
  toggleCompanyTask,
  updateCompanyPrep,
} from "../controllers/company.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/stats/summary", getCompanyPrepStats);

router.post("/", createCompanyPrep);
router.get("/", getMyCompanyPreps);
router.get("/:id", getCompanyPrepById);
router.patch("/:id/task", toggleCompanyTask);
router.patch("/:id", updateCompanyPrep);
router.delete("/:id", deleteCompanyPrep);

export default router;