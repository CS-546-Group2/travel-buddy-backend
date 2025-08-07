// Switched to Gemini because we can use the best model for a better price
import { GoogleGenAI } from "@google/genai";
import logger from "../utils/logger.js";

const apiKey = process.env["GEMINI_API_KEY"];
if (!apiKey) {
  logger.fatal("No Gemini API key found in the env! Exiting...");
}

// Initialize the client
const ai = new GoogleGenAI({
  apiKey: apiKey,
});

// Define the grounding tool
const groundingTool = {
  googleSearch: {},
};

const webConfig = {
  tools: [groundingTool],
};

const query = async (message, webSearch = true) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: message,
    ...(webSearch && { webConfig }),
  });

  return response;
};

export default query;
