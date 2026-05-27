import ApiError from "../utils/ApiError.js";

const notFoundHandler = (req, res, next) => {
    next(new ApiError(404, `Resource not found: ${req.originalUrl}`));
};

export default notFoundHandler;  
