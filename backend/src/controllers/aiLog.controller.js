import AiRequestLog from "../models/aiRequestLog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyAiRequestLogs = asyncHandler(async (req, res) => {
  const {
    module,
    status,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {
    user: req.user._id,
  };

  if (module) {
    filter.module = module;
  }

  if (status) {
    filter.status = status;
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const [logs, total] = await Promise.all([
    AiRequestLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    AiRequestLog.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
      "AI request logs fetched successfully"
    )
  );
});

export const getMyAiRequestStats = asyncHandler(async (req, res) => {
  const stats = await AiRequestLog.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: {
          module: "$module",
          status: "$status",
        },
        count: { $sum: 1 },
        averageDurationMs: { $avg: "$durationMs" },
      },
    },
    {
      $sort: {
        "_id.module": 1,
      },
    },
  ]);

  const recentFailures = await AiRequestLog.find({
    user: req.user._id,
    status: "failed",
  })
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats,
        recentFailures,
      },
      "AI request stats fetched successfully"
    )
  );
});