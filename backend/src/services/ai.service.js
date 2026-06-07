import ApiError from "../utils/ApiError.js";

const cleanAIText = (text = "") => {
  return String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
};

const removeTrailingCommas = (text = "") => {
  return text.replace(/,\s*([}\]])/g, "$1");
};

const extractJsonBlock = (text = "") => {
  const cleaned = cleanAIText(text);

  const firstObjectIndex = cleaned.indexOf("{");
  const firstArrayIndex = cleaned.indexOf("[");

  let startIndex = -1;
  let openingChar = "";
  let closingChar = "";

  if (firstObjectIndex === -1 && firstArrayIndex === -1) {
    return cleaned;
  }

  if (
    firstObjectIndex !== -1 &&
    (firstArrayIndex === -1 || firstObjectIndex < firstArrayIndex)
  ) {
    startIndex = firstObjectIndex;
    openingChar = "{";
    closingChar = "}";
  } else {
    startIndex = firstArrayIndex;
    openingChar = "[";
    closingChar = "]";
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString && char === openingChar) {
      depth++;
    }

    if (!inString && char === closingChar) {
      depth--;

      if (depth === 0) {
        return cleaned.slice(startIndex, i + 1);
      }
    }
  }

  return cleaned.slice(startIndex);
};

export const parseAIJsonResponse = (aiText) => {
  if (!aiText || typeof aiText !== "string") {
    throw new ApiError(500, "AI response is empty");
  }

  const jsonBlock = removeTrailingCommas(extractJsonBlock(aiText));

  try {
    return JSON.parse(jsonBlock);
  } catch (error) {
    console.log("AI JSON parse failed:", error.message);
    console.log("AI raw response preview:", String(aiText).slice(0, 500));

    throw new ApiError(500, "Failed to parse AI response");
  }
};

export const generateAIContent = async (prompt) => {
  if (!prompt || !String(prompt).trim()) {
    throw new ApiError(400, "AI prompt is required");
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, "GEMINI_API_KEY is missing");
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent(String(prompt));
    const response = result.response;
    const text = response.text();

    if (!text || !text.trim()) {
      throw new ApiError(500, "AI returned empty response");
    }

    return text.trim();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.log("AI generation failed:", error.message);

    throw new ApiError(
      500,
      "AI service failed. Please try again after some time."
    );
  }
};