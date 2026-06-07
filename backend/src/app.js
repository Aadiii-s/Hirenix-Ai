import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import dsaRoutes from "./routes/dsa.routes.js"
import readinessRoutes from "./routes/readiness.routes.js"
import interviewRoutes from "./routes/interview.routes.js"
import skillGapRoutes from "./routes/skillGap.routes.js"
import companyRoutes from "./routes/company.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js"

import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hirenix AI API is running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/interviews",interviewRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/readiness", readinessRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;