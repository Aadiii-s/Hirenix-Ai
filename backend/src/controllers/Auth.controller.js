import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "Full name, email, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

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
  return res
    .status(200)
    .json(new ApiResponse(200, {user:req.user,}, "Current user fetched successfully"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    college,
    branch,
    graduationYear,
    targetRole,
    targetCompanies,
    skills,
    currentPreparationLevel,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (college !== undefined) user.college = college;
  if (branch !== undefined) user.branch = branch;
  if (graduationYear !== undefined) user.graduationYear = graduationYear;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (targetCompanies !== undefined) user.targetCompanies = targetCompanies;
  if (skills !== undefined) user.skills = skills;
  if (currentPreparationLevel !== undefined) {
    user.currentPreparationLevel = currentPreparationLevel;
  }

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

  user.isProfileCompleted =
    requiredFields.every(Boolean) && hasTargetCompanies && hasSkills;

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