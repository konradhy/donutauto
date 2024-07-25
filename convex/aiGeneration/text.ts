import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuizContent = internalAction({
  args: {
    brandName: v.string(),
    brandDescription: v.string(),
    preferences: v.array(v.string()),
    location: v.string(),
    firstName: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `
      Create a quiz for a TikTok video for ${args.brandName}, a ${args.brandDescription} located in ${args.location}.
      The customer's name is ${args.firstName} and their preferences include: ${args.preferences.join(", ")}.
      Generate a JSON object with the following structure:
      {
        "deal": "A special offer related to the brand and customer preferences",
        "question": "An interesting question related to the brand or its products",
        "answerOne": "First possible answer",
        "answerTwo": "Second possible answer",
        "answerThree": "Third possible answer"
      }
      Ensure the content is engaging, relevant to the brand, and suitable for a TikTok audience.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    console.log("Response received:", JSON.stringify(response, null, 2));

    return JSON.parse(response.choices[0].message.content || "{}");
  },
});
