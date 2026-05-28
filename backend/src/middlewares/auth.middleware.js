import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"

export const protect = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request: token is missing");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Invalid token: user no longer exists");
  }

  req.user = user;

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Role '${req.user?.role}' is not allowed to access this resource`
      );
    }

    next();
  };
};