import ApiError from "./ApiError.js";

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isNonEmptyArray = (value) => {
  return Array.isArray(value) && value.length > 0;
};

export const validateResumeAnalysisResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI resume response is invalid");
  }

  if (typeof data.atsScore !== "number") {
    throw new ApiError(502, "AI resume response is missing atsScore");
  }

  if (data.atsScore < 0 || data.atsScore > 100) {
    throw new ApiError(502, "AI resume atsScore must be between 0 and 100");
  }

  if (!isNonEmptyString(data.summary)) {
    throw new ApiError(502, "AI resume response is missing summary");
  }

  return data;
};

export const validateRoadmapResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI roadmap response is invalid");
  }

  const dailyPlan =
    data.dailyPlan || data.days || data.roadmapDays || data.plan || [];

  if (!isNonEmptyArray(dailyPlan)) {
    throw new ApiError(
      502,
      "AI roadmap response did not contain a valid daily plan"
    );
  }

  return data;
};

export const validateSkillGapResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI skill gap response is invalid");
  }

  const hasRequiredSkills = Array.isArray(data.requiredSkills);
  const hasMissingSkills = Array.isArray(data.missingSkills);
  const hasPrioritySkills = Array.isArray(data.prioritySkills);

  if (!hasRequiredSkills && !hasMissingSkills && !hasPrioritySkills) {
    throw new ApiError(
      502,
      "AI skill gap response is incomplete. Please try again."
    );
  }

  return data;
};

export const validateInterviewQuestionsResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI interview response is invalid");
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new ApiError(
      502,
      "AI interview response did not contain valid questions"
    );
  }

  const invalidQuestion = data.questions.find(
    (question) => !isNonEmptyString(question.question)
  );

  if (invalidQuestion) {
    throw new ApiError(502, "AI interview question format is invalid");
  }

  return data;
};

export const validateAnswerEvaluationResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI answer evaluation response is invalid");
  }

  if (typeof data.score !== "number") {
    throw new ApiError(502, "AI answer evaluation is missing score");
  }

  if (data.score < 0 || data.score > 10) {
    throw new ApiError(502, "AI answer score must be between 0 and 10");
  }

  if (!isNonEmptyString(data.feedback)) {
    throw new ApiError(502, "AI answer evaluation is missing feedback");
  }

  return data;
};

export const validateInterviewSummaryResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new ApiError(502, "AI interview summary response is invalid");
  }

  if (!isNonEmptyString(data.overallFeedback)) {
    throw new ApiError(502, "AI interview summary is missing overallFeedback");
  }

  return data;
};