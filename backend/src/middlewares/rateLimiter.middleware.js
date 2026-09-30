import rateLimit from "express-rate-limit";

const buildUserOrIpKey = (req) => {
  return req.user?._id?.toString() || req.ip;
};

const rateLimitHandler = (req, res) => {
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down and try again in a few minutes.",
    errors: [],
  });
};

// General API-wide limiter — generous, just stops abuse/scripts
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildUserOrIpKey,
  handler: rateLimitHandler,
});

// Login/register — stricter, keyed by IP since there's no req.user yet.
// skipSuccessfulRequests means only failed attempts count toward the limit,
// so a legitimate user logging in repeatedly is never blocked.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
});

// AI-heavy endpoints — protects your Gemini quota specifically.
// Runs after `protect`, so req.user is available here.
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildUserOrIpKey,
  handler: rateLimitHandler,
});