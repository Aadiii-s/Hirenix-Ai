import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      trim: true,
      default: "",
    },

    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    improvedBullets: {
      type: [String],
      default: [],
    },

    projectSuggestions: {
      type: [String],
      default: [],
    },

    skillsSuggestions: {
      type: [String],
      default: [],
    },

    finalSuggestions: {
      type: [String],
      default: [],
    },

    rawAiResponse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);

export default ResumeAnalysis;