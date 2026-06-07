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

const allowedInterviewTypes = [
  "hr",
  "dsa",
  "mern",
  "project",
  "behavioral",
  "mixed",
];

const allowedDifficulties = ["easy", "medium", "hard"];

const getFallbackQuestions = ({
  interviewType,
  difficulty,
  numberOfQuestions,
}) => {
  const fallbackQuestions = [
    {
      question: "Tell me about yourself.",
      category: "hr",
      expectedAnswerPoints: [
        "Brief introduction",
        "Education background",
        "Technical skills",
        "Career goal",
      ],
    },
    {
      question: "Explain one strong project from your resume in detail.",
      category: "project",
      expectedAnswerPoints: [
        "Problem statement",
        "Tech stack",
        "Your contribution",
        "Impact or learning",
      ],
    },
    {
      question: "How do you approach solving a DSA problem in interviews?",
      category: "dsa",
      expectedAnswerPoints: [
        "Understand the problem",
        "Start with brute force",
        "Optimize step by step",
        "Explain time and space complexity",
      ],
    },
    {
      question: "Explain authentication and authorization.",
      category: "mern",
      expectedAnswerPoints: [
        "Authentication meaning",
        "Authorization meaning",
        "JWT/session example",
      ],
    },
    {
      question: "Why should we hire you?",
      category: "hr",
      expectedAnswerPoints: [
        "Relevant skills",
        "Learning mindset",
        "Project experience",
        "Teamwork",
      ],
    },
    {
      question: "Describe a difficult situation and how you handled it.",
      category: "behavioral",
      expectedAnswerPoints: ["Situation", "Task", "Action", "Result"],
    },
    {
      question: "What are your strengths and weaknesses?",
      category: "hr",
      expectedAnswerPoints: [
        "Real strength",
        "Improvement area",
        "How you are improving",
      ],
    },
    {
      question: "Explain REST API and common HTTP methods.",
      category: "mern",
      expectedAnswerPoints: [
        "REST meaning",
        "GET POST PUT PATCH DELETE",
        "Client-server communication",
      ],
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      category: "mern",
      expectedAnswerPoints: [
        "Structure",
        "Schema",
        "Use cases",
        "Examples",
      ],
    },
    {
      question: "Explain time complexity and why it matters.",
      category: "dsa",
      expectedAnswerPoints: [
        "Efficiency",
        "Big-O notation",
        "Scalability",
      ],
    },
  ];

  return fallbackQuestions.slice(0, numberOfQuestions).map((item) => ({
    question: item.question,
    category: interviewType === "mixed" ? item.category : interviewType,
    difficulty,
    expectedAnswerPoints: item.expectedAnswerPoints,
    userAnswer: "",
    feedback: "",
    idealAnswer: "",
    score: 0,
    isAnswered: false,
  }));
};

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

    questions = getFallbackQuestions({
      interviewType: normalizedInterviewType,
      difficulty: normalizedDifficulty,
      numberOfQuestions: safeNumberOfQuestions,
    });
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
  } catch (error) {
    console.log("Answer evaluation failed:", error.message);

    parsedEvaluation = {
      score: 6,
      feedback:
        "Good attempt. Improve your answer by adding structure, examples, and measurable impact.",
      strengths: ["Attempted the answer"],
      improvements: ["Add more structure", "Use examples"],
      idealAnswer:
        "A strong answer should directly answer the question, include examples, and explain the impact clearly.",
    };
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
  } catch (error) {
    console.log("Interview summary generation failed:", error.message);

    parsedSummary = {
      overallFeedback:
        overallScore >= 70
          ? "Good performance. Keep improving answer structure and examples."
          : "You need more practice. Focus on clarity, structure, and confidence.",
      strengths:
        overallScore >= 70
          ? ["Relevant answers", "Good attempt"]
          : ["Completed the interview"],
      improvements: [
        "Use structured answers",
        "Add examples",
        "Improve technical depth",
      ],
    };
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