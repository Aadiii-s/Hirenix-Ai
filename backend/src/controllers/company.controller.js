import mongoose from "mongoose";

import CompanyPrep from "../models/companyPrep.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {asyncHandler }from "../utils/asyncHandler.js";

const calculateCompanyProgress = (tasks = []) => {
  if (!tasks.length) return 0;

  const completedTasks = tasks.filter((task) => task.isCompleted).length;

  return Math.round((completedTasks / tasks.length) * 100);
};

export const createCompanyPrep = asyncHandler(async (req, res) => {
  const {
    companyName,
    targetRole,
    companyType,
    priority,
    applicationStatus,
    preparationFocus,
    tasks,
    notes,
  } = req.body;

  if (!companyName) {
    throw new ApiError(400, "Company name is required");
  }

  const alreadyExists = await CompanyPrep.findOne({
    user: req.user._id,
    companyName: new RegExp(`^${companyName}$`, "i"),
  });

  if (alreadyExists) {
    throw new ApiError(409, "Company preparation already exists");
  }

  const formattedTasks = Array.isArray(tasks)
    ? tasks.map((task) => ({
        title: task.title,
        category: task.category || "other",
        isCompleted: task.isCompleted || false,
        completedAt: task.isCompleted ? new Date() : null,
      }))
    : [];

  const companyPrep = await CompanyPrep.create({
    user: req.user._id,
    companyName,
    targetRole: targetRole || req.user.targetRole || "Software Development Engineer",
    companyType,
    priority,
    applicationStatus,
    preparationFocus: Array.isArray(preparationFocus) ? preparationFocus : [],
    tasks: formattedTasks,
    notes,
    progressPercentage: calculateCompanyProgress(formattedTasks),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        companyPrep,
        "Company preparation created successfully"
      )
    );
});

export const getMyCompanyPreps = asyncHandler(async (req, res) => {
  const {
    search,
    companyType,
    priority,
    applicationStatus,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const filter = {
    user: req.user._id,
  };

  if (search) {
    filter.$or = [
      { companyName: new RegExp(search, "i") },
      { targetRole: new RegExp(search, "i") },
      { notes: new RegExp(search, "i") },
      { preparationFocus: { $in: [new RegExp(search, "i")] } },
    ];
  }

  if (companyType) {
    filter.companyType = companyType;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (applicationStatus) {
    filter.applicationStatus = applicationStatus;
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const companies = await CompanyPrep.find(filter).sort({
    [sortBy]: sortOrder,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        companies,
        "Company preparations fetched successfully"
      )
    );
});

export const getCompanyPrepById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid company preparation id");
  }

  const companyPrep = await CompanyPrep.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!companyPrep) {
    throw new ApiError(404, "Company preparation not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        companyPrep,
        "Company preparation fetched successfully"
      )
    );
});

export const updateCompanyPrep = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid company preparation id");
  }

  const companyPrep = await CompanyPrep.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!companyPrep) {
    throw new ApiError(404, "Company preparation not found");
  }

  const allowedFields = [
    "companyName",
    "targetRole",
    "companyType",
    "priority",
    "applicationStatus",
    "preparationFocus",
    "tasks",
    "notes",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      companyPrep[field] = req.body[field];
    }
  });

  companyPrep.progressPercentage = calculateCompanyProgress(companyPrep.tasks);

  const updatedCompanyPrep = await companyPrep.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCompanyPrep,
        "Company preparation updated successfully"
      )
    );
});

export const toggleCompanyTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid company preparation id");
  }

  if (!taskId) {
    throw new ApiError(400, "Task id is required");
  }

  const companyPrep = await CompanyPrep.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!companyPrep) {
    throw new ApiError(404, "Company preparation not found");
  }

  const task = companyPrep.tasks.id(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.isCompleted = !task.isCompleted;
  task.completedAt = task.isCompleted ? new Date() : null;

  companyPrep.progressPercentage = calculateCompanyProgress(companyPrep.tasks);

  const updatedCompanyPrep = await companyPrep.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCompanyPrep,
        task.isCompleted
          ? "Task marked as completed"
          : "Task marked as incomplete"
      )
    );
});

export const deleteCompanyPrep = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid company preparation id");
  }

  const companyPrep = await CompanyPrep.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!companyPrep) {
    throw new ApiError(404, "Company preparation not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Company preparation deleted successfully"));
});

export const getCompanyPrepStats = asyncHandler(async (req, res) => {
  const totalCompanies = await CompanyPrep.countDocuments({
    user: req.user._id,
  });

  const highPriorityCompanies = await CompanyPrep.countDocuments({
    user: req.user._id,
    priority: "high",
  });

  const appliedCompanies = await CompanyPrep.countDocuments({
    user: req.user._id,
    applicationStatus: {
      $ne: "not_applied",
    },
  });

  const interviewingCompanies = await CompanyPrep.countDocuments({
    user: req.user._id,
    applicationStatus: "interviewing",
  });

  const companies = await CompanyPrep.find({
    user: req.user._id,
  }).select("progressPercentage companyType applicationStatus priority");

  const averageProgress =
    companies.length === 0
      ? 0
      : Math.round(
          companies.reduce(
            (sum, company) => sum + company.progressPercentage,
            0
          ) / companies.length
        );

  const typeStats = await CompanyPrep.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: "$companyType",
        total: { $sum: 1 },
        averageProgress: { $avg: "$progressPercentage" },
      },
    },
  ]);

  const stats = {
    totalCompanies,
    highPriorityCompanies,
    appliedCompanies,
    interviewingCompanies,
    averageProgress,
    typeStats,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats,
        "Company preparation stats fetched successfully"
      )
    );
});