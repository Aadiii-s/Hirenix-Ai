import mongoose from "mongoose";

const dsaQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },

    platform: {
      type: String,
      enum: ["leetcode", "gfg", "codeforces", "codingninjas", "other"],
      default: "leetcode",
    },

    questionUrl: {
      type: String,
      trim: true,
      default: "",
    },

    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "solved", "revision"],
      default: "not_started",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    approach: {
      type: String,
      trim: true,
      default: "",
    },

    timeComplexity: {
      type: String,
      trim: true,
      default: "",
    },

    spaceComplexity: {
      type: String,
      trim: true,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DsaQuestion = mongoose.model("DsaQuestion", dsaQuestionSchema);

export default DsaQuestion;