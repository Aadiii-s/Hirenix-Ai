import ApiError from "./ApiError.js";

const activeAiRequests = new Map();

const DEFAULT_TTL_MS = 2 * 60 * 1000;

const buildLockKey = (req, scope) => {
  const userId = req.user?._id?.toString() || "anonymous";
  const resourceId = req.params?.id || "global";
  const questionId = req.body?.questionId || "";

  return `${userId}:${scope}:${resourceId}:${questionId}`;
};

export const withAiRequestLock = (scope, ttlMs = DEFAULT_TTL_MS) => {
  return (req, res, next) => {
    const lockKey = buildLockKey(req, scope);

    if (activeAiRequests.has(lockKey)) {
      throw new ApiError(
        429,
        "An AI request is already running. Please wait for it to complete."
      );
    }

    const timeout = setTimeout(() => {
      activeAiRequests.delete(lockKey);
    }, ttlMs);

    activeAiRequests.set(lockKey, {
      startedAt: Date.now(),
      timeout,
    });

    const releaseLock = () => {
      const lock = activeAiRequests.get(lockKey);

      if (lock?.timeout) {
        clearTimeout(lock.timeout);
      }

      activeAiRequests.delete(lockKey);
    };

    res.once("finish", releaseLock);
    res.once("close", releaseLock);

    next();
  };
};