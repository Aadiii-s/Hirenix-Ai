export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (message) return message;

  if (status === 502) {
    return "AI returned an incomplete response. Please try again.";
  }

  if (status === 503) {
    return "AI service is temporarily unavailable. Please try again after some time.";
  }

  if (status === 500) {
    return "Server error occurred. Please try again.";
  }

  return fallback;
};