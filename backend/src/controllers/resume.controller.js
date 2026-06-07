import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { requiredString } from "../utils/validators.js";
import { buildResumeAnalysisPrompt } from "../utils/resumePrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

const deleteLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.log("Resume file delete error:", error.message);
  }
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getFallbackResumeAnalysis = () => {
  return {
    atsScore: 55,
    summary:
      "Resume analysis completed with fallback response. Improve keywords, project impact, and measurable achievements.",
    strengths: ["Resume uploaded successfully", "Basic resume content detected"],
    weaknesses: [
      "Needs stronger role-specific keywords",
      "Needs more measurable project impact",
    ],
    missingKeywords: ["DSA", "System Design", "React", "Node.js", "MongoDB"],
    improvedBullets: [
      "Built a full-stack application using React, Node.js, Express.js, and MongoDB with authentication and protected routes.",
      "Improved project quality by adding clean UI, API integration, validation, and error handling.",
    ],
    projectSuggestions: [
      "Add measurable impact for every project.",
      "Mention tech stack, features, challenges, and results clearly.",
    ],
    skillsSuggestions: [
      "Add role-specific technical skills.",
      "Group skills into languages, frontend, backend, database, tools, and concepts.",
    ],
    finalSuggestions: [
      "Use action verbs and numbers in bullet points.",
      "Optimize resume for target role keywords.",
    ],
  };
};

export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume PDF file is required");
  }

  const filePath = req.file.path;

  try {
    if (!fs.existsSync(filePath)) {
      throw new ApiError(500, "Uploaded resume file not found on server");
    }

    const targetRole =
      req.body.targetRole?.trim() ||
      req.user.targetRole ||
      "Software Developer";

    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);

    const resumeText = pdfData.text?.trim();

    if (!resumeText || resumeText.length < 100) {
      throw new ApiError(
        400,
        "Could not extract enough text from resume. Please upload a text-based PDF."
      );
    }

    const user = req.user;

    const prompt = buildResumeAnalysisPrompt({
      fullName: user.fullName,
      targetRole,
      skills: user.skills || [],
      resumeText,
    });

    let aiText = "";
    let parsedAnalysis = {};

    try {
      aiText = await generateAIContent(prompt);
      parsedAnalysis = parseAIJsonResponse(aiText) || {};
    } catch (error) {
      console.log("Resume AI analysis failed:", error.message);
      parsedAnalysis = getFallbackResumeAnalysis();
      aiText = JSON.stringify(parsedAnalysis);
    }

    const analysis = await ResumeAnalysis.create({
      user: user._id,
      originalFileName: req.file.originalname,
      resumeText,
      targetRole,
      atsScore: safeNumber(parsedAnalysis.atsScore),
      summary: parsedAnalysis.summary || "",
      strengths: safeArray(parsedAnalysis.strengths),
      weaknesses: safeArray(parsedAnalysis.weaknesses),
      missingKeywords: safeArray(parsedAnalysis.missingKeywords),
      improvedBullets: safeArray(parsedAnalysis.improvedBullets),
      projectSuggestions: safeArray(parsedAnalysis.projectSuggestions),
      skillsSuggestions: safeArray(parsedAnalysis.skillsSuggestions),
      finalSuggestions: safeArray(parsedAnalysis.finalSuggestions),
      finalAdvice:
        parsedAnalysis.finalAdvice ||
        parsedAnalysis.finalSuggestion ||
        parsedAnalysis.finalSuggestions?.[0] ||
        "",
      improvements:
        safeArray(parsedAnalysis.improvements).length > 0
          ? safeArray(parsedAnalysis.improvements)
          : safeArray(parsedAnalysis.finalSuggestions),
      rawAiResponse: aiText,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, analysis, "Resume analyzed successfully"));
  } finally {
    deleteLocalFile(filePath);
  }
});

export const getMyResumeAnalyses = asyncHandler(async (req, res) => {
  const analyses = await ResumeAnalysis.find({
    user: req.user._id,
  })
    .select("-resumeText -rawAiResponse")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, analyses, "Resume analyses fetched successfully")
    );
});

export const getResumeAnalysisById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid resume analysis id");

  const analysis = await ResumeAnalysis.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Resume analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, analysis, "Resume analysis fetched successfully"));
});

export const getLatestResumeAnalysis = asyncHandler(async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({
    user: req.user._id,
  })
    .select("-resumeText -rawAiResponse")
    .sort({ createdAt: -1 });

  if (!analysis) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No resume analysis found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analysis,
        "Latest resume analysis fetched successfully"
      )
    );
});

export const deleteResumeAnalysis = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid resume analysis id");

  const analysis = await ResumeAnalysis.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!analysis) {
    throw new ApiError(404, "Resume analysis not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Resume analysis deleted successfully"));
});