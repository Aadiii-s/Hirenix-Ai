import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  requiredString,
  requiredEmail,
  requiredPassword,
  normalizeEnum,
  normalizeArray,
  normalizeGraduationYear,
} from "../utils/validators.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const allowedPreparationLevels = ["beginner", "intermediate", "advanced"];

const sanitizeUser = (user) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    college: user.college,
    branch: user.branch,
    graduationYear: user.graduationYear,
    targetRole: user.targetRole,
    targetCompanies: user.targetCompanies,
    skills: user.skills,
    currentPreparationLevel: user.currentPreparationLevel,
    avatar: user.avatar,
    isProfileCompleted: user.isProfileCompleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const calculateProfileCompleted = (user) => {
  const requiredFields = [
    user.college,
    user.branch,
    user.graduationYear,
    user.targetRole,
    user.currentPreparationLevel,
  ];

  const hasTargetCompanies =
    Array.isArray(user.targetCompanies) && user.targetCompanies.length > 0;

  const hasSkills = Array.isArray(user.skills) && user.skills.length > 0;

  return requiredFields.every(Boolean) && hasTargetCompanies && hasSkills;
};

export const registerUser = asyncHandler(async (req, res) => {
  const fullName = requiredString(req.body.fullName, "Full name");
  const email = requiredEmail(req.body.email);
  const password = requiredPassword(req.body.password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const accessToken = user.generateAccessToken();

  const createdUser = await User.findById(user._id);

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: sanitizeUser(createdUser),
          accessToken,
        },
        "User registered successfully"
      )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const email = requiredEmail(req.body.email);
  const password = requiredString(req.body.password, "Password");

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: sanitizeUser(loggedInUser),
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sanitizeUser(user),
        "Current user fetched successfully"
      )
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const {
    fullName,
    college,
    branch,
    graduationYear,
    targetRole,
    targetCompanies,
    skills,
    currentPreparationLevel,
    avatar,
  } = req.body;

  if (fullName !== undefined) {
    user.fullName = requiredString(fullName, "Full name");
  }

  if (college !== undefined) {
    user.college = String(college).trim();
  }

  if (branch !== undefined) {
    user.branch = String(branch).trim();
  }

  if (graduationYear !== undefined) {
  const normalizedYear = normalizeGraduationYear(graduationYear);
  if (normalizedYear !== undefined) {
    user.graduationYear = normalizedYear;
  }
}

  if (targetRole !== undefined) {
    user.targetRole = String(targetRole).trim();
  }

  if (targetCompanies !== undefined) {
    user.targetCompanies = normalizeArray(targetCompanies);
  }

  if (skills !== undefined) {
    user.skills = normalizeArray(skills);
  }

  if (currentPreparationLevel !== undefined) {
    user.currentPreparationLevel = normalizeEnum(
      currentPreparationLevel,
      allowedPreparationLevels,
      "preparation level",
      "beginner"
    );
  }

  if (avatar !== undefined) {
    user.avatar = String(avatar).trim();
  }

  user.isProfileCompleted = calculateProfileCompleted(user);

  const updatedUser = await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sanitizeUser(updatedUser),
        "Profile updated successfully"
      )
    );
});