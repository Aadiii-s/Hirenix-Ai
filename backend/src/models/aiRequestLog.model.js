import mongoose from "mongoose";

const aiRequestLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    module: {
      type: String,
      enum: ["resume", "roadmap", "skill_gap", "interview"],
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["started", "success", "failed"],
      default: "started",
      index: true,
    },

    statusCode: {
      type: Number,
      default: 200,
    },

    errorMessage: {
      type: String,
      default: "",
    },

    model: {
      type: String,
      default: "",
    },

    durationMs: {
      type: Number,
      default: 0,
    },

    requestMeta: {
      type: Object,
      default: {},
    },

    responseMeta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const AiRequestLog = mongoose.model("AiRequestLog", aiRequestLogSchema);

export default AiRequestLog;