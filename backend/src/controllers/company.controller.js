import CompanyPrep from "../models/companyPrep.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import {
  requiredString,
  normalizeEnum,
  normalizeArray,
} from "../utils/validators.js";

const allowedCompanyTypes = [
  "product",
  "service",
  "startup",
  "fintech",
  "consulting",
  "other",
];

const allowedPriorities = ["high", "medium", "low"];

const allowedApplicationStatuses = [
  "not_applied",
  "applied",
  "shortlisted",
  "interviewing",
  "offered",
  "rejected",
];

const allowedTaskCategories = [
  "dsa",
  "system_design",
  "project",
  "resume",
  "aptitude",
  "interview",
  "research",
  "other",
];

const calculateCompanyProgress = (tasks = []) => {
  if (!tasks.length) return 0;

  const completedTasks = tasks.filter((task) => task.isCompleted).length;

  return Math.round((completedTasks / tasks.length) * 100);
};

const escapeRegex = (text = "") => {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatTasks = (tasks = []) => {
  if (!Array.isArray(tasks)) return [];

  return tasks
    .filter((task) => task?.title && String(task.title).trim())
    .map((task) => {
      const isCompleted = Boolean(task.isCompleted);

      return {
        title: String(task.title).trim(),
        category: allowedTaskCategories.includes(task.category)
          ? task.category
          : "other",
        isCompleted,
        completedAt: isCompleted ? task.completedAt || new Date() : null,
      };
    });
};

export const createCompanyPrep = asyncHandler(async (req, res) => {
  const companyName = requiredString(req.body.companyName, "Company name");

  const targetRole =
    req.body.targetRole?.trim() ||
    req.user.targetRole ||
    "Software Development Engineer";

  const companyType = normalizeEnum(
    req.body.companyType,
    allowedCompanyTypes,
    "company type",
    "product"
  );

  const priority = normalizeEnum(
    req.body.priority,
    allowedPriorities,
    "priority",
    "medium"
  );

  const applicationStatus = normalizeEnum(
    req.body.applicationStatus,
    allowedApplicationStatuses,
    "application status",
    "not_applied"
  );

  const preparationFocus = normalizeArray(req.body.preparationFocus);
  const formattedTasks = formatTasks(req.body.tasks);
  const notes = req.body.notes ? String(req.body.notes).trim() : "";

  const alreadyExists = await CompanyPrep.findOne({
    user: req.user._id,
    companyName: new RegExp(`^${escapeRegex(companyName)}$`, "i"),
  });

  if (alreadyExists) {
    throw new ApiError(409, "Company preparation already exists");
  }

  const companyPrep = await CompanyPrep.create({
    user: req.user._id,
    companyName,
    targetRole,
    companyType,
    priority,
    applicationStatus,
    preparationFocus,
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
    const safeSearch = escapeRegex(search);

    filter.$or = [
      { companyName: new RegExp(safeSearch, "i") },
      { targetRole: new RegExp(safeSearch, "i") },
      { notes: new RegExp(safeSearch, "i") },
      { preparationFocus: { $in: [new RegExp(safeSearch, "i")] } },
    ];
  }

  if (companyType) {
    filter.companyType = normalizeEnum(
      companyType,
      allowedCompanyTypes,
      "company type",
      "product"
    );
  }

  if (priority) {
    filter.priority = normalizeEnum(
      priority,
      allowedPriorities,
      "priority",
      "medium"
    );
  }

  if (applicationStatus) {
    filter.applicationStatus = normalizeEnum(
      applicationStatus,
      allowedApplicationStatuses,
      "application status",
      "not_applied"
    );
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "companyName",
    "priority",
    "applicationStatus",
    "progressPercentage",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const companies = await CompanyPrep.find(filter).sort({
    [safeSortBy]: sortOrder,
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

  validateMongoId(id, "Invalid company preparation id");

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

  validateMongoId(id, "Invalid company preparation id");

  const companyPrep = await CompanyPrep.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!companyPrep) {
    throw new ApiError(404, "Company preparation not found");
  }

  if (req.body.companyName !== undefined) {
    companyPrep.companyName = requiredString(
      req.body.companyName,
      "Company name"
    );
  }

  if (req.body.targetRole !== undefined) {
    companyPrep.targetRole = requiredString(req.body.targetRole, "Target role");
  }

  if (req.body.companyType !== undefined) {
    companyPrep.companyType = normalizeEnum(
      req.body.companyType,
      allowedCompanyTypes,
      "company type",
      "product"
    );
  }

  if (req.body.priority !== undefined) {
    companyPrep.priority = normalizeEnum(
      req.body.priority,
      allowedPriorities,
      "priority",
      "medium"
    );
  }

  if (req.body.applicationStatus !== undefined) {
    companyPrep.applicationStatus = normalizeEnum(
      req.body.applicationStatus,
      allowedApplicationStatuses,
      "application status",
      "not_applied"
    );
  }

  if (req.body.preparationFocus !== undefined) {
    companyPrep.preparationFocus = normalizeArray(req.body.preparationFocus);
  }

  if (req.body.tasks !== undefined) {
    companyPrep.tasks = formatTasks(req.body.tasks);
  }

  if (req.body.notes !== undefined) {
    companyPrep.notes = String(req.body.notes).trim();
  }

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

  validateMongoId(id, "Invalid company preparation id");

  if (!taskId) {
    throw new ApiError(400, "Task id is required");
  }

  validateMongoId(taskId, "Invalid task id");

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

  validateMongoId(id, "Invalid company preparation id");

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
            (sum, company) => sum + (Number(company.progressPercentage) || 0),
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