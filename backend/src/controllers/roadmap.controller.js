import Roadmap from "../models/roadmap.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { buildRoadmapPrompt } from "../utils/roadmapPrompt.js";
import mongoose from "mongoose";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

export const generateRoadmap = asyncHandler(async (req, res) => {
  const {
    targetRole,
    targetCompany,
    durationInDays,
    currentLevel,
    skills,
    weakAreas,
  } = req.body;

  if (!targetRole || !durationInDays || !currentLevel) {
    throw new ApiError(
      400,
      "Target role, duration in days, and current level are required"
    );
  }

  if (durationInDays < 7 || durationInDays > 180) {
    throw new ApiError(400, "Duration must be between 7 and 180 days");
  }

  const user = req.user;

  const finalSkills =
    Array.isArray(skills) && skills.length > 0 ? skills : user.skills;

  const prompt = buildRoadmapPrompt({
    fullName: user.fullName,
    targetRole,
    targetCompany,
    durationInDays,
    currentLevel,
    skills: finalSkills,
    weakAreas,
    college: user.college,
    branch: user.branch,
  });

  const aiText = await generateAIContent(prompt);
  const parsedRoadmap = parseAIJsonResponse(aiText);

  const roadmap = await Roadmap.create({
    user: user._id,
    title:
      parsedRoadmap.title ||
      `${durationInDays}-Day ${targetRole} Placement Roadmap`,
    targetRole,
    targetCompany: targetCompany || "",
    durationInDays,
    currentLevel,
    skills: finalSkills,
    weakAreas: Array.isArray(weakAreas) ? weakAreas : [],
    roadmapText: aiText,
    dailyPlan: parsedRoadmap.dailyPlan || [],
    weeklyMilestones: parsedRoadmap.weeklyMilestones || [],
    recommendedResources: parsedRoadmap.recommendedResources || [],
    aiSuggestions: parsedRoadmap.aiSuggestions || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, roadmap, "AI roadmap generated successfully"));
});

export const getMyRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, roadmaps, "Roadmaps fetched successfully"));
});

export const getRoadmapById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid roadmap id");
  }

  const roadmap = await Roadmap.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

export const deleteRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid roadmap id");
  }

  const roadmap = await Roadmap.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Roadmap deleted successfully"));
});