import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    targetCompany: {
      type: String,
      trim: true,
      default: "",
    },

    durationInDays: {
      type: Number,
      required: true,
      min: 7,
      max: 180,
    },

    currentLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    weakAreas: {
      type: [String],
      default: [],
    },

    roadmapText: {
      type: String,
      required: true,
    },

    dailyPlan: {
      type: [
        {
          day: Number,
          title: String,
          tasks: [String],
          focusArea: String,
          estimatedHours: Number,
        },
      ],
      default: [],
    },

    weeklyMilestones: {
      type: [
        {
          week: Number,
          goal: String,
          topics: [String],
          deliverables: [String],
        },
      ],
      default: [],
    },

    recommendedResources: {
      type: [String],
      default: [],
    },

    aiSuggestions: {
      type: [String],
      default: [],
    },
    completedDays: {
      type: [Number],
      default: [],
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;