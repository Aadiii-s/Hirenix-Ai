import DsaQuestion from "../models/dsaQuestion.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import {
  requiredString,
  normalizeEnum,
  normalizeArray,
} from "../utils/validators.js";

const allowedPlatforms = [
  "leetcode",
  "gfg",
  "codeforces",
  "codechef",
  "hackerrank",
  "other",
];

const allowedDifficulties = ["easy", "medium", "hard"];

const allowedStatuses = [
  "not_started",
  "in_progress",
  "solved",
  "revision",
];

const escapeRegex = (text = "") => {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getQuestionUrl = (body) => {
  return body.questionUrl || body.problemUrl || "";
};

export const createDsaQuestion = asyncHandler(async (req, res) => {
  const title = requiredString(req.body.title, "Question title");
  const topic = requiredString(req.body.topic, "Topic");

  const platform = normalizeEnum(
    req.body.platform,
    allowedPlatforms,
    "platform",
    "leetcode"
  );

  const difficulty = normalizeEnum(
    req.body.difficulty,
    allowedDifficulties,
    "difficulty",
    "medium"
  );

  const status = normalizeEnum(
    req.body.status,
    allowedStatuses,
    "status",
    "not_started"
  );

  const question = await DsaQuestion.create({
    user: req.user._id,
    title,
    platform,
    questionUrl: getQuestionUrl(req.body),
    problemUrl: getQuestionUrl(req.body),
    topic,
    difficulty,
    status,
    notes: req.body.notes || "",
    approach: req.body.approach || "",
    timeComplexity: req.body.timeComplexity || "",
    spaceComplexity: req.body.spaceComplexity || "",
    tags: normalizeArray(req.body.tags),
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
    filter.topic = new RegExp(escapeRegex(topic), "i");
  }

  if (difficulty) {
    filter.difficulty = normalizeEnum(
      difficulty,
      allowedDifficulties,
      "difficulty",
      "medium"
    );
  }

  if (status) {
    filter.status = normalizeEnum(
      status,
      allowedStatuses,
      "status",
      "not_started"
    );
  }

  if (platform) {
    filter.platform = normalizeEnum(
      platform,
      allowedPlatforms,
      "platform",
      "leetcode"
    );
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    filter.$or = [
      { title: new RegExp(safeSearch, "i") },
      { topic: new RegExp(safeSearch, "i") },
      { notes: new RegExp(safeSearch, "i") },
      { tags: { $in: [new RegExp(safeSearch, "i")] } },
    ];
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "title",
    "topic",
    "difficulty",
    "status",
    "platform",
    "solvedAt",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const sortOrder = order === "asc" ? 1 : -1;

  const questions = await DsaQuestion.find(filter).sort({
    [safeSortBy]: sortOrder,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "DSA questions fetched successfully"));
});

export const getDsaQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid DSA question id");

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

  validateMongoId(id, "Invalid DSA question id");

  const status = normalizeEnum(
    req.body.status,
    allowedStatuses,
    "question status",
    "not_started"
  );

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

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedQuestion,
      "DSA question status updated successfully"
    )
  );
});

export const updateDsaQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid DSA question id");

  const question = await DsaQuestion.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!question) {
    throw new ApiError(404, "DSA question not found");
  }

  if (req.body.title !== undefined) {
    question.title = requiredString(req.body.title, "Question title");
  }

  if (req.body.topic !== undefined) {
    question.topic = requiredString(req.body.topic, "Topic");
  }

  if (req.body.platform !== undefined) {
    question.platform = normalizeEnum(
      req.body.platform,
      allowedPlatforms,
      "platform",
      "leetcode"
    );
  }

  if (req.body.difficulty !== undefined) {
    question.difficulty = normalizeEnum(
      req.body.difficulty,
      allowedDifficulties,
      "difficulty",
      "medium"
    );
  }

  if (req.body.status !== undefined) {
    const status = normalizeEnum(
      req.body.status,
      allowedStatuses,
      "status",
      "not_started"
    );

    question.status = status;
    question.solvedAt = status === "solved" ? new Date() : null;
  }

  if (req.body.questionUrl !== undefined || req.body.problemUrl !== undefined) {
    const url = getQuestionUrl(req.body);
    question.questionUrl = url;
    question.problemUrl = url;
  }

  if (req.body.notes !== undefined) {
    question.notes = req.body.notes;
  }

  if (req.body.approach !== undefined) {
    question.approach = req.body.approach;
  }

  if (req.body.timeComplexity !== undefined) {
    question.timeComplexity = req.body.timeComplexity;
  }

  if (req.body.spaceComplexity !== undefined) {
    question.spaceComplexity = req.body.spaceComplexity;
  }

  if (req.body.tags !== undefined) {
    question.tags = normalizeArray(req.body.tags);
  }

  const updatedQuestion = await question.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedQuestion, "DSA question updated successfully")
    );
});

export const deleteDsaQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoId(id, "Invalid DSA question id");

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