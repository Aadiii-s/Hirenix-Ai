import MockInterview from "../models/mockInterview.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import {
  requiredString,
  normalizeEnum,
  normalizeArray,
  normalizeNumberInRange,
} from "../utils/validators.js";
import {
  buildAnswerEvaluationPrompt,
  buildInterviewQuestionsPrompt,
  buildInterviewSummaryPrompt,
} from "../utils/interviewPrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";
import { validateInterviewQuestionsResponse, validateAnswerEvaluationResponse, validateInterviewSummaryResponse } from "../utils/aiResponseValidators.js";

const allowedInterviewTypes = [
  "hr",
  "dsa",
  "mern",
  "project",
  "behavioral",
  "mixed",
];

const allowedDifficulties = ["easy", "medium", "hard"];


const normalizeGeneratedQuestions = ({
  parsedQuestions,
  normalizedInterviewType,
  normalizedDifficulty,
  safeNumberOfQuestions,
}) => {
  const aiQuestions = Array.isArray(parsedQuestions)
    ? parsedQuestions
    : parsedQuestions?.questions;

  if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
    throw new Error("Invalid AI questions format");
  }

  return aiQuestions.slice(0, safeNumberOfQuestions).map((q) => ({
    question: q.question || q.title || "Interview question",
    category: q.category || normalizedInterviewType,
    difficulty: q.difficulty || normalizedDifficulty,
    expectedAnswerPoints:
      q.expectedAnswerPoints || q.expectedPoints || q.points || [],
    userAnswer: "",
    feedback: "",
    idealAnswer: "",
    score: 0,
    isAnswered: false,
  }));
};

export const startMockInterview = asyncHandler(async (req, res) => {
  const title = req.body.title?.trim();

  const targetRole = requiredString(req.body.targetRole, "Target role");

  const normalizedInterviewType = normalizeEnum(
    req.body.interviewType,
    allowedInterviewTypes,
    "interview type",
    "mixed"
  );

  const normalizedDifficulty = normalizeEnum(
    req.body.difficulty,
    allowedDifficulties,
    "difficulty level",
    "medium"
  );

  const safeNumberOfQuestions = normalizeNumberInRange(
    req.body.numberOfQuestions,
    5,
    3,
    10,
    "Number of questions"
  );

  const safeFocusAreas = normalizeArray(req.body.focusAreas);

  const prompt = buildInterviewQuestionsPrompt({
    fullName: req.user.fullName,
    targetRole,
    skills: req.user.skills || [],
    interviewType: normalizedInterviewType,
    difficulty: normalizedDifficulty,
    questionCount: safeNumberOfQuestions,
    focusAreas: safeFocusAreas,
  });

  let questions = [];
  let parsedQuestions = {};

  try {
    const aiText = await generateAIContent(prompt);
    parsedQuestions = parseAIJsonResponse(aiText);

    questions = normalizeGeneratedQuestions({
      parsedQuestions,
      normalizedInterviewType,
      normalizedDifficulty,
      safeNumberOfQuestions,
    });
  } catch (error) {
    console.log("Interview question generation failed:", error.message);

    throw new ApiError(
      503,
      "AI interview question generation failed. Please try again after some time."
    );
  }

  const mockInterview = await MockInterview.create({
    user: req.user._id,
    title:
      title ||
      parsedQuestions?.title ||
      `${targetRole} ${normalizedInterviewType} interview`,
    interviewType: normalizedInterviewType,
    targetRole,
    difficulty: normalizedDifficulty,
    numberOfQuestions: safeNumberOfQuestions,
    focusAreas: safeFocusAreas,
    questions,
    status: "in_progress",
    overallScore: 0,
    overallFeedback: "",
    strengths: [],
    improvements: [],
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        mockInterview,
        "Mock interview started successfully"
      )
    );
});

export const submitInterviewAnswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questionId, answer } = req.body;

  validateMongoId(id, "Invalid interview id");

  if (!questionId) {
    throw new ApiError(400, "Question id is required");
  }

  if (!answer?.trim()) {
    throw new ApiError(400, "Answer is required");
  }

  const interview = await MockInterview.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Mock interview not found");
  }

  if (interview.status === "completed") {
    throw new ApiError(400, "Cannot submit answer to a completed interview");
  }

  const question = interview.questions.id(questionId);

  if (!question) {
    throw new ApiError(404, "Interview question not found");
  }

  const prompt = buildAnswerEvaluationPrompt({
    question: question.question,
    expectedAnswerPoints: question.expectedAnswerPoints,
    userAnswer: answer,
  });

  let parsedEvaluation = {};

try {
  const aiText = await generateAIContent(prompt);
  parsedEvaluation = parseAIJsonResponse(aiText) || {};
  validateAnswerEvaluationResponse(parsedEvaluation);
} catch (error) {
  console.log("Answer evaluation failed:", error.message);

  throw new ApiError(
    error.statusCode || 503,
    error.statusCode === 502
      ? error.message
      : "AI answer evaluation failed. Please try again after some time."
  );
}

  question.userAnswer = answer.trim();
  question.feedback =
    parsedEvaluation.feedback ||
    "Good attempt. Add more structure and examples.";
  question.score = Math.min(Math.max(Number(parsedEvaluation.score) || 0, 0), 10);
  question.isAnswered = true;

  if (parsedEvaluation.idealAnswer !== undefined) {
    question.idealAnswer = parsedEvaluation.idealAnswer;
  }

  const updatedInterview = await interview.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        interview: updatedInterview,
        evaluation: {
          score: question.score,
          feedback: question.feedback,
          strengths: parsedEvaluation.strengths || [],
          improvements: parsedEvaluation.improvements || [],
          idealAnswer: parsedEvaluation.idealAnswer || "",
        },
      },
      "Answer evaluated successfully"
    )
  );
});

export const completeMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid interview id");

  const interview = await MockInterview.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Mock interview not found");
  }

  const answeredQuestions = interview.questions.filter(
    (question) => question.isAnswered
  );

  if (answeredQuestions.length === 0) {
    throw new ApiError(400, "Answer at least one question before completing");
  }

  const totalScore = answeredQuestions.reduce(
    (sum, question) => sum + (Number(question.score) || 0),
    0
  );

  const overallScore = Math.round(
    (totalScore / (answeredQuestions.length * 10)) * 100
  );

  const prompt = buildInterviewSummaryPrompt({
    title: interview.title,
    interviewType: interview.interviewType,
    questions: interview.questions,
  });

  let parsedSummary = {};

try {
  const aiText = await generateAIContent(prompt);
  parsedSummary = parseAIJsonResponse(aiText) || {};
  validateInterviewSummaryResponse(parsedSummary);
} catch (error) {
  console.log("Interview summary generation failed:", error.message);

  throw new ApiError(
    error.statusCode || 503,
    error.statusCode === 502
      ? error.message
      : "AI interview summary generation failed. Please try again after some time."
  );
}

  interview.overallScore = overallScore;
  interview.overallFeedback =
    parsedSummary.overallFeedback ||
    "Interview completed. Keep practicing to improve your score.";
  interview.strengths = parsedSummary.strengths || [];
  interview.improvements = parsedSummary.improvements || [];
  interview.status = "completed";
  interview.completedAt = new Date();

  const completedInterview = await interview.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        completedInterview,
        "Mock interview completed successfully"
      )
    );
});

export const getMyMockInterviews = asyncHandler(async (req, res) => {
  const interviews = await MockInterview.find({
    user: req.user._id,
  })
    .select("-questions.expectedAnswerPoints")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, interviews, "Mock interviews fetched successfully")
    );
});

export const getMockInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid interview id");

  const interview = await MockInterview.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Mock interview not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, interview, "Mock interview fetched successfully"));
});

export const getLatestMockInterview = asyncHandler(async (req, res) => {
  const interview = await MockInterview.findOne({
    user: req.user._id,
  })
    .select("-questions.expectedAnswerPoints")
    .sort({ createdAt: -1 });

  if (!interview) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No mock interview found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        interview,
        "Latest mock interview fetched successfully"
      )
    );
});

export const deleteMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid interview id");

  const interview = await MockInterview.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!interview) {
    throw new ApiError(404, "Mock interview not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Mock interview deleted successfully"));
});

export const getMockInterviewStats = asyncHandler(async (req, res) => {
  const totalInterviews = await MockInterview.countDocuments({
    user: req.user._id,
  });

  const completedInterviews = await MockInterview.countDocuments({
    user: req.user._id,
    status: "completed",
  });

  const inProgressInterviews = await MockInterview.countDocuments({
    user: req.user._id,
    status: "in_progress",
  });

  const completedList = await MockInterview.find({
    user: req.user._id,
    status: "completed",
  }).select("overallScore interviewType createdAt");

  const averageScore =
    completedList.length === 0
      ? 0
      : Math.round(
        completedList.reduce(
          (sum, interview) => sum + (Number(interview.overallScore) || 0),
          0
        ) / completedList.length
      );

  const typeStats = await MockInterview.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: "$interviewType",
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        averageScore: {
          $avg: "$overallScore",
        },
      },
    },
  ]);

  const stats = {
    totalInterviews,
    completedInterviews,
    inProgressInterviews,
    averageScore,
    typeStats,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Mock interview stats fetched successfully")
    );
});