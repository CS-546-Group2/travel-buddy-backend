import { GoogleGenAI } from "@google/genai";

// Configure the client
const ai = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

// Define the grounding tool
const groundingTool = {
  googleSearch: {},
};

// Configure generation settings
const config = {
  tools: [groundingTool],
};

const query = async (message, webSearch) => {
  // Make the request
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: message,
    ...(webSearch && { config }),
  });

  return response;
};

export default query;
