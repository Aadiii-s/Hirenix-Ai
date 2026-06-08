import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMongoStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] || "unknown";
};

export const getHealthStatus = asyncHandler(async (req, res) => {
  const health = {
    app: "Hirenix AI Backend",
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeInSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",

    database: {
      status: getMongoStatus(),
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },

    config: {
      jwtConfigured: Boolean(process.env.JWT_SECRET),
      mongoConfigured: Boolean(process.env.MONGO_URI),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      geminiModel: process.env.GEMINI_MODEL || null,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, health, "Backend health check successful"));
});