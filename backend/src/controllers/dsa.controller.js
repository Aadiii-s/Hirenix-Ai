import mongoose from "mongoose";

import DsaQuestion from "../models/dsaQuestion.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createDsaQuestion = asyncHandler(async (req, res) => {
  const {
    title,
    platform,
    questionUrl,
    topic,
    difficulty,
    status,
    notes,
    approach,
    timeComplexity,
    spaceComplexity,
    tags,
  } = req.body;

  if (!title || !topic || !difficulty) {
    throw new ApiError(400, "Title, topic, and difficulty are required");
  }

  const question = await DsaQuestion.create({
    user: req.user._id,
    title,
    platform,
    questionUrl,
    topic,
    difficulty,
    status,
    notes,
    approach,
    timeComplexity,
    spaceComplexity,
    tags: Array.isArray(tags) ? tags : [],
    solvedAt: status === "solved" ? new Date() : null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "DSA question added successfully"));
});

export const getMyDsaQuestions = asyncHandler(async (req, res) => {
  const {
    topic,
    difficulty,
    status,
    platform,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const filter = {
    user: req.user._id,
  };

  if (topic) {
    filter.topic = new RegExp(topic, "i");
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (status) {
    filter.status = status;
  }

  if (platform) {
    filter.platform = platform;
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") },
      { topic: new RegExp(search, "i") },
      { notes: new RegExp(search, "i") },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const questions = await DsaQuestion.find(filter).sort({
    [sortBy]: sortOrder,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "DSA questions fetched successfully"));
});

export const getDsaQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid DSA question id");
  }

  const question = await DsaQuestion.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!question) {
    throw new ApiError(404, "DSA question not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, question, "DSA question fetched successfully"));
});

export const updateDsaQuestionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid DSA question id");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const allowedStatuses = ["not_started", "in_progress", "solved", "revision"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid question status");
  }

  const question = await DsaQuestion.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!question) {
    throw new ApiError(404, "DSA question not found");
  }

  question.status = status;
  question.solvedAt = status === "solved" ? new Date() : null;

  const updatedQuestion = await question.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedQuestion,
        "DSA question status updated successfully"
      )
    );
});

export const updateDsaQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid DSA question id");
  }

  const question = await DsaQuestion.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!question) {
    throw new ApiError(404, "DSA question not found");
  }

  const allowedFields = [
    "title",
    "platform",
    "questionUrl",
    "topic",
    "difficulty",
    "status",
    "notes",
    "approach",
    "timeComplexity",
    "spaceComplexity",
    "tags",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      question[field] = req.body[field];
    }
  });

  if (req.body.status !== undefined) {
    question.solvedAt = req.body.status === "solved" ? new Date() : null;
  }

  const updatedQuestion = await question.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuestion, "DSA question updated successfully"));
});

export const deleteDsaQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid DSA question id");
  }

  const question = await DsaQuestion.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!question) {
    throw new ApiError(404, "DSA question not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "DSA question deleted successfully"));
});

export const getDsaStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalQuestions = await DsaQuestion.countDocuments({ user: userId });

  const solvedQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "solved",
  });

  const inProgressQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "in_progress",
  });

  const revisionQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "revision",
  });

  const notStartedQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "not_started",
  });

  const easySolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "easy",
    status: "solved",
  });

  const mediumSolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "medium",
    status: "solved",
  });

  const hardSolved = await DsaQuestion.countDocuments({
    user: userId,
    difficulty: "hard",
    status: "solved",
  });

  const topicStats = await DsaQuestion.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$topic",
        total: { $sum: 1 },
        solved: {
          $sum: {
            $cond: [{ $eq: ["$status", "solved"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  const completionPercentage =
    totalQuestions === 0
      ? 0
      : Math.round((solvedQuestions / totalQuestions) * 100);

  const stats = {
    totalQuestions,
    solvedQuestions,
    inProgressQuestions,
    revisionQuestions,
    notStartedQuestions,
    completionPercentage,
    difficultyBreakdown: {
      easySolved,
      mediumSolved,
      hardSolved,
    },
    topicStats,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "DSA stats fetched successfully"));
});