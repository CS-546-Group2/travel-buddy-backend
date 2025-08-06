// Switched to Gemini because we can use the best model for a good price
import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

// Define the grounding tool
const groundingTool = {
  googleSearch: {},
};

const config = {
  tools: [groundingTool],
};

const query = async (message, webSearch) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: message,
    ...(webSearch && { config }),
  });

  return response;
};

export default query;
