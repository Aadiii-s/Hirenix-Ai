import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";

export const generateAIContent = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      throw new ApiError(500, "Gemini API key is missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new ApiError(500, "AI did not return any response");
    }

    return text;
  } catch (error) {
    console.error("FULL GEMINI ERROR:", error);
    console.error("GEMINI ERROR MESSAGE:", error.message);

    throw new ApiError(500, error.message || "AI content generation failed");
  }
};

export const parseAIJsonResponse = (text) => {
  try {
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI JSON parse error:", error.message);

    throw new ApiError(
      500,
      "AI response could not be parsed. Please try again."
    );
  }
};