import mongoose from "mongoose";

import MockInterview from "../models/mockInterview.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {
  buildAnswerEvaluationPrompt,
  buildInterviewQuestionsPrompt,
  buildInterviewSummaryPrompt,
} from "../utils/interviewPrompt.js";
import {
  generateAIContent,
  parseAIJsonResponse,
} from "../services/ai.service.js";

export const startMockInterview = asyncHandler(async (req, res) => {
  const {
    interviewType,
    targetRole,
    difficulty = "intermediate",
    questionCount = 5,
  } = req.body;

  if (!interviewType) {
    throw new ApiError(400, "Interview type is required");
  }

  const allowedTypes = ["hr", "dsa", "mern", "project", "behavioral", "mixed"];
  const allowedDifficulty = ["beginner", "intermediate", "advanced"];

  if (!allowedTypes.includes(interviewType)) {
    throw new ApiError(400, "Invalid interview type");
  }

  if (!allowedDifficulty.includes(difficulty)) {
    throw new ApiError(400, "Invalid difficulty level");
  }

  const finalQuestionCount = Number(questionCount);

  if (finalQuestionCount < 3 || finalQuestionCount > 10) {
    throw new ApiError(400, "Question count must be between 3 and 10");
  }

  const user = req.user;

  const prompt = buildInterviewQuestionsPrompt({
    fullName: user.fullName,
    targetRole: targetRole || user.targetRole || "Software Development Engineer",
    skills: user.skills,
    interviewType,
    difficulty,
    questionCount: finalQuestionCount,
  });

  const aiText = await generateAIContent(prompt);
  const parsedInterview = parseAIJsonResponse(aiText);

  const interview = await MockInterview.create({
    user: user._id,
    title:
      parsedInterview.title ||
      `${interviewType.toUpperCase()} Mock Interview`,
    interviewType,
    targetRole: targetRole || user.targetRole || "Software Development Engineer",
    difficulty,
    questions: parsedInterview.questions || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, interview, "Mock interview started successfully"));
});

export const submitInterviewAnswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questionId, answer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

  if (!questionId || !answer) {
    throw new ApiError(400, "Question id and answer are required");
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

  const aiText = await generateAIContent(prompt);
  const parsedEvaluation = parseAIJsonResponse(aiText);

  question.userAnswer = answer;
  question.feedback = parsedEvaluation.feedback || "";
  question.score = parsedEvaluation.score || 0;
  question.isAnswered = true;

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

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
    (sum, question) => sum + question.score,
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

  const aiText = await generateAIContent(prompt);
  const parsedSummary = parseAIJsonResponse(aiText);

  interview.overallScore = overallScore;
  interview.overallFeedback = parsedSummary.overallFeedback || "";
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

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
        user : req.user._id,
    })
      .select("-questions.expectedAnswerPoints")
      .sort({createdAt: -1});

    if(!interview){
        return res.status(200).json(new ApiResponse(200 , null, "No mock interview found"));
    }
    return res.status(200)
               .json(new ApiResponse(200 ,interview, "latest mock interview fetched successfully"));
})

export const deleteMockInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

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
            (sum, interview) => sum + interview.overallScore,
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
    .json(new ApiResponse(200, stats, "Mock interview stats fetched successfully"));
});