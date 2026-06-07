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
  const number = Number(value) || defaultValue;

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