import Roadmap from "../models/roadmap.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import {
  requiredString,
  normalizeEnum,
  normalizeArray,
  normalizeNumberInRange,
} from "../utils/validators.js";
import { buildRoadmapPrompt } from "../utils/roadmapPrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";
import { validateRoadmapResponse } from "../utils/aiResponseValidators.js";

const allowedLevels = ["beginner", "intermediate", "advanced"];

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const normalizeRoadmapDays = (dailyPlan = [], durationInDays) => {
  if (!Array.isArray(dailyPlan)) return [];

  return dailyPlan.slice(0, durationInDays).map((day, index) => {
    const dayNumber = Number(day.day || day.dayNumber || index + 1);

    return {
      day: dayNumber,
      title: day.title || day.topic || day.focus || `Day ${dayNumber}`,
      description:
        day.description ||
        day.summary ||
        day.goal ||
        "Complete the planned preparation tasks for this day.",
      tasks: safeArray(day.tasks || day.taskList || day.activities),
      resources: safeArray(day.resources || day.learningResources || day.links),
      practice: safeArray(day.practice || day.practiceProblems || day.exercises),
      outcome: day.outcome || day.expectedOutcome || "",
    };
  });
};

export const generateRoadmap = asyncHandler(async (req, res) => {
  const targetRole = requiredString(req.body.targetRole, "Target role");

  const durationInDays = normalizeNumberInRange(
    req.body.durationInDays,
    30,
    7,
    180,
    "Duration"
  );

  const currentLevel = normalizeEnum(
    req.body.currentLevel,
    allowedLevels,
    "current level",
    "beginner"
  );

  const targetCompany = req.body.targetCompany
    ? String(req.body.targetCompany).trim()
    : "";

  const user = req.user;

  const requestSkills = normalizeArray(req.body.skills);
  const profileSkills = normalizeArray(user.skills);
  const finalSkills = requestSkills.length > 0 ? requestSkills : profileSkills;

  const weakAreas = normalizeArray(req.body.weakAreas || req.body.focusAreas);

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

  let aiText = "";
let parsedRoadmap = {};

try {
  aiText = await generateAIContent(prompt);
  parsedRoadmap = parseAIJsonResponse(aiText) || {};
  validateRoadmapResponse(parsedRoadmap);
} catch (error) {
  console.log("Roadmap AI generation failed:", error.message);

  throw new ApiError(
    error.statusCode || 503,
    error.statusCode === 502
      ? error.message
      : "AI roadmap generation failed. Please try again after some time."
  );
}

  const finalDailyPlan = normalizeRoadmapDays(
  parsedRoadmap.dailyPlan ||
    parsedRoadmap.days ||
    parsedRoadmap.roadmapDays ||
    parsedRoadmap.plan ||
    [],
  durationInDays
);

if (!finalDailyPlan.length) {
  throw new ApiError(
    502,
    "AI roadmap response did not contain a valid daily plan. Please try again."
  );
}

  const roadmap = await Roadmap.create({
    user: user._id,
    title:
      parsedRoadmap.title ||
      `${durationInDays}-Day ${targetRole} Placement Roadmap`,
    description:
      parsedRoadmap.description ||
      `Personalized ${durationInDays}-day roadmap for ${targetRole}.`,
    targetRole,
    targetCompany,
    durationInDays,
    currentLevel,
    skills: finalSkills,
    weakAreas,
    roadmapText: aiText,
    dailyPlan: finalDailyPlan,
    days: finalDailyPlan,
    weeklyMilestones: safeArray(parsedRoadmap.weeklyMilestones),
    recommendedResources: safeArray(parsedRoadmap.recommendedResources),
    aiSuggestions: safeArray(parsedRoadmap.aiSuggestions),
    completedDays: [],
    progressPercentage: 0,
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

  validateMongoId(id, "Invalid roadmap id");

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

  validateMongoId(id, "Invalid roadmap id");

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

export const toggleRoadmapDayCompletion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid roadmap id");

  const dayValue = req.body.day ?? req.body.dayNumber;

  if (!dayValue) {
    throw new ApiError(400, "Day is required");
  }

  const roadmap = await Roadmap.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  const dayNumber = Number(dayValue);

  if (!Number.isInteger(dayNumber)) {
    throw new ApiError(400, "Day must be a valid number");
  }

  if (dayNumber < 1 || dayNumber > roadmap.durationInDays) {
    throw new ApiError(
      400,
      `Day must be between 1 and ${roadmap.durationInDays}`
    );
  }

  const completedDays = Array.isArray(roadmap.completedDays)
    ? roadmap.completedDays.map(Number)
    : [];

  const isAlreadyCompleted = completedDays.includes(dayNumber);

  if (isAlreadyCompleted) {
    roadmap.completedDays = completedDays.filter(
      (completedDay) => completedDay !== dayNumber
    );
  } else {
    roadmap.completedDays = [...completedDays, dayNumber];
  }

  roadmap.completedDays.sort((a, b) => a - b);

  roadmap.progressPercentage = Math.round(
    (roadmap.completedDays.length / roadmap.durationInDays) * 100
  );

  const updatedRoadmap = await roadmap.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedRoadmap,
        isAlreadyCompleted
          ? "Roadmap day marked as incomplete"
          : "Roadmap day marked as completed"
      )
    );
});

export const getLatestRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  if (!roadmap) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No roadmap found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, roadmap, "Latest roadmap fetched successfully"));
});