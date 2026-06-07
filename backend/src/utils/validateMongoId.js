import mongoose from "mongoose";
import ApiError from "./ApiError.js";

export const validateMongoId = (id, message = "Invalid id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message);
  }
};