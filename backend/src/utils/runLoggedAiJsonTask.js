import ApiError from "./ApiError.js";
import {
  createAiRequestLog,
  markAiRequestFailure,
  markAiRequestSuccess,
} from "./aiLogger.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

export const runLoggedAiJsonTask = async ({
  req,
  module,
  action,
  prompt,
  requestMeta = {},
  validateResponse,
}) => {
  const startTime = Date.now();

  const log = await createAiRequestLog({
    userId: req.user._id,
    module,
    action,
    requestMeta,
  });

  try {
    const aiText = await generateAIContent(prompt);
    const parsed = parseAIJsonResponse(aiText);

    if (validateResponse) {
      validateResponse(parsed);
    }

    await markAiRequestSuccess({
      logId: log?._id,
      durationMs: Date.now() - startTime,
      responseMeta: {
        responseType: Array.isArray(parsed) ? "array" : typeof parsed,
        keys:
          parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? Object.keys(parsed)
            : [],
      },
    });

    return {
      aiText,
      parsed,
    };
  } catch (error) {
    await markAiRequestFailure({
      logId: log?._id,
      durationMs: Date.now() - startTime,
      error,
    });

    if (error instanceof ApiError || error.statusCode) {
      throw error;
    }

    throw new ApiError(
      503,
      "AI service failed. Please try again after some time."
    );
  }
};