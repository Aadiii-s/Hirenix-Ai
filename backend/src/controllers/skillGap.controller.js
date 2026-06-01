import mongoose from "mongoose";

import DsaQuestion from "../models/dsaQuestion.model.js";
import MockInterview from "../models/mockInterview.model.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import Roadmap from "../models/roadmap.model.js";
import SkillGapAnalysis from "../models/skillGapAnalysis.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildSkillGapPrompt } from "../utils/skillGapPrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

const getDsaStatsForUser = async (userId) => {
  const totalQuestions = await DsaQuestion.countDocuments({ user: userId });

  const solvedQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "solved",
  });

  const easySolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "easy",
    status: "solved",
  });

  const mediumSolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "medium",
    status: "solved",
  });

  const hardSolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "hard",
    status: "solved",
  });

  return {
    totalQuestions,
    solvedQuestions,
    completionPercentage:
      totalQuestions === 0
        ? 0
        : Math.round((solvedQuestions / totalQuestions) * 100),
    difficultyBreakdown: {
      easySolved,
      mediumSolved,
      hardSolved,
    },
  };
};

const getInterviewStatsForUser = async (userId) => {
  const completedInterviews = await MockInterview.find({
    user: userId,
    status: "completed",
  }).select("overallScore");

  const averageScore =
    completedInterviews.length === 0
      ? 0
      : Math.round(
        completedInterviews.reduce(
          (sum, interview) => sum + interview.overallScore,
          0
        ) / completedInterviews.length
      );

  return {
    completedInterviews: completedInterviews.length,
    averageScore,
  };
};

export const generateSkillGapAnalysis = asyncHandler(async (req, res) => {
  const user = req.user;

  const targetRole =
    req.body.targetRole || user.targetRole || "Software Development Engineer";

  const latestResumeAnalysis = await ResumeAnalysis.findOne({
    user: user._id,
  })
    .select("-resumeText -rawAiResponse")
    .sort({ createdAt: -1 });

  const latestRoadmap = await Roadmap.findOne({
    user: user._id,
  }).sort({ createdAt: -1 });


  const dsaStats = await getDsaStatsForUser(user._id);
  const interviewStats = await getInterviewStatsForUser(user._id);

  const prompt = buildSkillGapPrompt({
    fullName: user.fullName,
    targetRole,
    targetCompanies: user.targetCompanies,
    userSkills: user.skills,
    resumeScore: latestResumeAnalysis?.atsScore || 0,
    resumeMissingKeywords: latestResumeAnalysis?.missingKeywords || [],
    dsaStats,
    roadmapProgress: latestRoadmap?.progressPercentage || 0,
    interviewStats,
  });

  const aiText = await generateAIContent(prompt);
  const parsed = parseAIJsonResponse(aiText);

  const topThreeFocusAreas =
  parsed.topThreeFocusAreas?.length > 0
    ? parsed.topThreeFocusAreas
        .slice(0, 3)
        .map((focus) => (typeof focus === "string" ? focus : focus?.skill))
        .filter(Boolean)
    : parsed.prioritySkills?.length > 0
    ? parsed.prioritySkills
        .slice(0, 3)
        .map((item) => (typeof item === "string" ? item : item?.skill))
        .filter(Boolean)
    : [];

  const analysis = await SkillGapAnalysis.create({
    user: user._id,
    targetRole,
    targetCompanies: user.targetCompanies || [],
    currentSkills: user.skills || [],
    requiredSkills: parsed.requiredSkills || [],
    missingSkills: parsed.missingSkills || [],
    weakSkills: parsed.weakSkills || [],
    strongSkills: parsed.strongSkills || [],
    prioritySkills: parsed.prioritySkills || [],
    topThreeFocusAreas: parsed.topThreeFocusAreas || [],
    learningPlan: parsed.learningPlan || [],
    summary: parsed.summary || "",
    readinessImpact: parsed.readinessImpact || "medium",
    rawAiResponse: aiText,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, analysis, "Skill gap analysis generated successfully")
    );
});

export const getLatestSkillGapAnalysis = asyncHandler(async (req, res) => {
  const analysis = await SkillGapAnalysis.findOne({
    user: req.user._id,
  })
    .select("-rawAiResponse")
    .sort({ createdAt: -1 });

  if (!analysis) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No skill gap analysis found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, analysis, "Latest skill gap analysis fetched successfully")
    );
});

export const getMySkillGapAnalyses = asyncHandler(async (req, res) => {
  const analyses = await SkillGapAnalysis.find({
    user: req.user._id,
  })
    .select("-rawAiResponse")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, analyses, "Skill gap analyses fetched successfully")
    );
});

export const getSkillGapAnalysisById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid skill gap analysis id");
  }

  const analysis = await SkillGapAnalysis.findOne({
    _id: id,
    user: req.user._id,
  }).select("-rawAiResponse");

  if (!analysis) {
    throw new ApiError(404, "Skill gap analysis not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, analysis, "Skill gap analysis fetched successfully")
    );
});

export const deleteSkillGapAnalysis = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid skill gap analysis id");
  }

  const analysis = await SkillGapAnalysis.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Skill gap analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Skill gap analysis deleted successfully"));
});