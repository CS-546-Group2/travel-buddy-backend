import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const queryModel = async (message, systemPrompt, webSearch) => {  
  const response = await client.responses.create({
    model: "gpt-4o-mini", // TODO choose a model
    instructions: systemPrompt,
    ...(webSearch && { tools: [{ type: "web_search_preview" }] }),
    input: message,
  });
};
