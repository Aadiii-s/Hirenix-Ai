import { createRequire } from "module";
import fs from "fs";
import mongoose from "mongoose";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildResumeAnalysisPrompt } from "../utils/resumePrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume PDF file is required");
  }

  const { targetRole } = req.body;

  const filePath = req.file.path;

  if (!fs.existsSync(filePath)) {
    throw new ApiError(500, "Uploaded resume file not found on server");
  }

  const fileBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(fileBuffer);

  const resumeText = pdfData.text?.trim();

  if (!resumeText || resumeText.length < 100) {
    deleteLocalFile(filePath);
    throw new ApiError(
      400,
      "Could not extract enough text from resume. Please upload a text-based PDF."
    );
  }

  const user = req.user;

  const finalTargetRole = targetRole || user.targetRole || "Software Developer";

  const prompt = buildResumeAnalysisPrompt({
    fullName: user.fullName,
    targetRole: finalTargetRole,
    skills: user.skills,
    resumeText,
  });

  const aiText = await generateAIContent(prompt);
  const parsedAnalysis = parseAIJsonResponse(aiText);

  const analysis = await ResumeAnalysis.create({
    user: user._id,
    originalFileName: req.file.originalname,
    resumeText,
    targetRole: finalTargetRole,
    atsScore: parsedAnalysis.atsScore || 0,
    summary: parsedAnalysis.summary || "",
    strengths: parsedAnalysis.strengths || [],
    weaknesses: parsedAnalysis.weaknesses || [],
    missingKeywords: parsedAnalysis.missingKeywords || [],
    improvedBullets: parsedAnalysis.improvedBullets || [],
    projectSuggestions: parsedAnalysis.projectSuggestions || [],
    skillsSuggestions: parsedAnalysis.skillsSuggestions || [],
    finalSuggestions: parsedAnalysis.finalSuggestions || [],
    rawAiResponse: aiText,
  });

  deleteLocalFile(filePath);

  return res
    .status(201)
    .json(new ApiResponse(201, analysis, "Resume analyzed successfully"));
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid resume analysis id");
  }

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid resume analysis id");
  }

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