import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["hr", "dsa", "mern", "project", "behavioral", "mixed"],
      default: "mixed",
    },

    expectedAnswerPoints: {
      type: [String],
      default: [],
    },

    userAnswer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const mockInterviewSchema = new mongoose.Schema(
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

    interviewType: {
      type: String,
      enum: ["hr", "dsa", "mern", "project", "behavioral", "mixed"],
      required: true,
    },

    targetRole: {
      type: String,
      trim: true,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },

    questions: {
      type: [interviewQuestionSchema],
      default: [],
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;