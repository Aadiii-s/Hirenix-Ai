import mongoose from "mongoose";

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    targetCompanies: {
      type: [String],
      default: [],
    },

    currentSkills: {
      type: [String],
      default: [],
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    weakSkills: {
      type: [String],
      default: [],
    },

    strongSkills: {
      type: [String],
      default: [],
    },

    prioritySkills: {
      type: [
        {
          skill: String,
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
          },
          reason: String,
          suggestedAction: String,
        },
      ],
      default: [],
    },

    learningPlan: {
      type: [
        {
          week: Number,
          focus: String,
          skills: [String],
          tasks: [String],
        },
      ],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    readinessImpact: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
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

const SkillGapAnalysis = mongoose.model(
  "SkillGapAnalysis",
  skillGapAnalysisSchema
);

export default SkillGapAnalysis;