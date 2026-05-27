import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    const healthData = {
        app : "Hirenix AI",
        tagline : "Intelligent Placement Preparation Platform",
        environment : process.env.NODE_ENV || "development",
        uptime : process.uptime(),
        timestamp : new Date()
    };  
    res.status(200).json(new ApiResponse(200, healthData, "API is healthy"));
});

