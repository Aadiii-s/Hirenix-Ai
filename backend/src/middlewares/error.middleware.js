import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = Array.isArray(err.errors) ? err.errors : [];

  // ApiError instances (thrown deliberately across your controllers) always
  // carry success: false — treat these as "known" errors whose message is
  // already safe and intentional, regardless of their status code.
  let isKnownError = err.success === false;

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    isKnownError = true;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum allowed size is 2MB.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field. Please check the upload field name.";
    } else {
      message = err.message || "File upload error";
    }
  } else if (err.name === "CastError") {
    statusCode = 400;
    isKnownError = true;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    isKnownError = true;
    errors = Object.values(err.errors).map((fieldError) => ({
      field: fieldError.path,
      message: fieldError.message,
    }));
    message = errors.map((e) => e.message).join(", ") || "Validation failed";
  } else if (err.code === 11000) {
    statusCode = 409;
    isKnownError = true;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field || "Field"} already exists`;
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    isKnownError = true;
    message = "Session expired. Please log in again.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    isKnownError = true;
    message = "Invalid token. Please log in again.";
  }

  // Always log the real error server-side — this is what you'll actually
  // debug from once deployed, regardless of what the client sees.
  if (!isKnownError) {
    console.error(`[${req.method} ${req.originalUrl}] Unexpected error:`, err);
  } else if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}] ${statusCode}: ${message}`);
  } else {
    console.log(`[${req.method} ${req.originalUrl}] ${statusCode}: ${message}`);
  }

  // Never expose raw internal error text for unexpected failures in production
  const safeMessage =
    process.env.NODE_ENV === "production" && !isKnownError
      ? "Something went wrong on our end. Please try again later."
      : message;

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
    errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorMiddleware;