import ApiError from "./ApiError.js";

export const requiredString = (value, fieldName) => {
  if (!value || !String(value).trim()) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  return String(value).trim();
};

export const normalizeEnum = (value, allowedValues, fieldName, defaultValue) => {
  const normalized = String(value || defaultValue).toLowerCase();

  if (!allowedValues.includes(normalized)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }

  return normalized;
};

export const normalizeNumberInRange = (
  value,
  defaultValue,
  min,
  max,
  fieldName
) => {
  const number =
    value === undefined || value === null || value === ""
      ? defaultValue
      : Number(value);

  if (!Number.isFinite(number)) {
    throw new ApiError(400, `${fieldName} must be a valid number`);
  }

  if (number < min || number > max) {
    throw new ApiError(400, `${fieldName} must be between ${min} and ${max}`);
  }

  return number;
};

export const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const requiredEmail = (value, fieldName = "Email") => {
  const email = requiredString(value, fieldName).toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, `${fieldName} must be a valid email address`);
  }

  return email;
};

export const requiredPassword = (
  value,
  fieldName = "Password",
  minLength = 6
) => {
  const password = requiredString(value, fieldName);

  if (password.length < minLength) {
    throw new ApiError(
      400,
      `${fieldName} must be at least ${minLength} characters long`
    );
  }

  return password;
};

export const normalizeOptionalString = (value, maxLength = 500) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value).trim().slice(0, maxLength);
};

export const normalizeGraduationYear = (
  value,
  fieldName = "Graduation year"
) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const year = Number(value);
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(year) || year < currentYear - 10 || year > currentYear + 10) {
    throw new ApiError(
      400,
      `${fieldName} must be a valid year between ${currentYear - 10} and ${currentYear + 10}`
    );
  }

  return year;
};

export const normalizePagination = (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = ({ page, limit, total }) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
};