import AiRequestLog from "../models/aiRequestLog.model.js";

export const createAiRequestLog = async ({
  userId,
  module,
  action,
  requestMeta = {},
}) => {
  try {
    return await AiRequestLog.create({
      user: userId,
      module,
      action,
      status: "started",
      model: process.env.GEMINI_MODEL || "",
      requestMeta,
    });
  } catch (error) {
    console.log("AI log create failed:", error.message);
    return null;
  }
};

export const markAiRequestSuccess = async ({
  logId,
  durationMs,
  responseMeta = {},
}) => {
  try {
    if (!logId) return;

    await AiRequestLog.findByIdAndUpdate(logId, {
      status: "success",
      statusCode: 200,
      durationMs,
      responseMeta,
    });
  } catch (error) {
    console.log("AI log success update failed:", error.message);
  }
};

export const markAiRequestFailure = async ({
  logId,
  durationMs,
  error,
}) => {
  try {
    if (!logId) return;

    await AiRequestLog.findByIdAndUpdate(logId, {
      status: "failed",
      statusCode: error?.statusCode || 500,
      errorMessage: error?.message || "AI request failed",
      durationMs,
    });
  } catch (logError) {
    console.log("AI log failure update failed:", logError.message);
  }
};