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
    contents: message + "\nWeb search is enabled for this request if needed.",
    ...(webSearch && { webConfig }),
  });

  return response;
};

export const generateItinerary = async (trip) => {
  const responseSchema = `
  [
    day: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    items: [{
      time: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['sightseeing', 'food', 'logistics', 'cultural', 'adventure', 'relaxation', 'transport'],
        required: true
      },
      description: String,
      location: String,
      duration: Number, // in minutes
      cost: Number,
      bookingRequired: {
        type: Boolean,
        default: false
      },
      bookingInfo: {
        website: String,
        phone: String,
        notes: String
      },
    }]
  ]
  `;
  const prompt = `
    Generate a concise day-by-day itinerary for the following trip details:
    - Destination: ${trip.destination}
    - Start: ${trip.startDate}
    - End: ${trip.endDate}
    - Days: ${trip.duration}
    - Budget: $${trip.budget}

    The user has specified these preferences which you must take into account when planning:
    - Travel style: ${trip.preferences.travelStyle}
    - Interests: ${trip.preferences.interests.toString()}
    - Budget range: ${trip.preferences.budgetRange}
    - Preferred accommodation: ${trip.preferences.accommodationStyle}

    Your response must be completely in JSON and adhere to the following MongoDB Mongoose schema:
    ${responseSchema}

    Generate an entry for each day in the trip, consider both arrival time and depature time.

    Important: Nothing except valid stringified JSON is allowed, as it will be fed directly into JSON.parse()
  `;

  const response = await query(prompt);
  return response.text;
};

export const generateRecs = async (trip) => {
  const responseSchema = `
  {
    attractions: [{
      name: String,
      description: String,
      location: String,
      rating: Number,
      cost: Number,
      category: String,
    }],
    restaurants: [{
      name: String,
      cuisine: String,
      description: String,
      location: String,
      rating: Number,
      priceRange: String,
      dietaryOptions: [String],
    }],
    experiences: [{
      name: String,
      description: String,
      category: String,
      duration: Number,
      cost: Number,
      location: String,
    }]
  }
  `;
  const prompt = `
    Generate a personalized list of attraction, restaurant, and experience recommendations for the following trip details:
    - Destination: ${trip.destination}
    - Start: ${trip.startDate}
    - End: ${trip.endDate}
    - Days: ${trip.duration}
    - Budget: $${trip.budget}

    The user has specified these preferences which you must take into account when planning:
    - Travel style: ${trip.preferences.travelStyle}
    - Interests: ${trip.preferences.interests.toString()}
    - Budget range: ${trip.preferences.budgetRange}
    - Preferred accommodation: ${trip.preferences.accommodationStyle}
    
    Your response must be completely in JSON and adhere to the following MongoDB Mongoose schema:
    ${responseSchema}
    
    Generate 3-5 items for each recommendation category.

    Important: Nothing except valid stringified JSON is allowed, as it will be fed directly into JSON.parse()
  `;

  const response = await query(prompt);
  return response.text;
};

export const generateTips = async (trip) => {
  const responseSchema = `
  [{
    category: {
      type: String,
      enum: ['cultural', 'transportation', 'safety', 'language', 'weather', 'money', 'food', 'customs'],
      required: true
    },
    title: String,
    content: String,
    importance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }]
  `;
  const prompt = `
    Generate an informative list of travel tips for the following trip details:
    - Destination: ${trip.destination}
    - Start: ${trip.startDate}
    - End: ${trip.endDate}
    - Days: ${trip.duration}
    - Budget: $${trip.budget}

    The user has specified these preferences which you must take into account when planning:
    - Travel style: ${trip.preferences.travelStyle}
    - Interests: ${trip.preferences.interests.toString()}
    - Budget range: ${trip.preferences.budgetRange}
    - Preferred accommodation: ${trip.preferences.accommodationStyle}
    
    Your response must be completely in JSON and adhere to the following MongoDB Mongoose schema:
    ${responseSchema}

    Generate as many travel tips as you think will be useful given the available categories above.

    Important: Nothing except valid stringified JSON is allowed, as it will be fed directly into JSON.parse()
  `;

  const response = await query(prompt);
  return response.text;
}
