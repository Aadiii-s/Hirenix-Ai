import mongoose from "mongoose";

const companyTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["dsa", "resume", "interview", "aptitude", "project", "cs", "other"],
      default: "other",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  }
);

const companyPrepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    targetRole: {
      type: String,
      default: "Software Development Engineer",
      trim: true,
    },

    companyType: {
      type: String,
      enum: ["product", "service", "startup", "fintech", "consulting", "other"],
      default: "product",
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    applicationStatus: {
      type: String,
      enum: [
        "not_applied",
        "applied",
        "shortlisted",
        "interviewing",
        "offered",
        "rejected",
      ],
      default: "not_applied",
    },

    preparationFocus: {
      type: [String],
      default: [],
    },

    tasks: {
      type: [companyTaskSchema],
      default: [],
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyPrep = mongoose.model("CompanyPrep", companyPrepSchema);

export default CompanyPrep;