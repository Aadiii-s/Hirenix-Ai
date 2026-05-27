const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    };
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    return res.status(statusCode).json(response);
};

export default errorMiddleware;