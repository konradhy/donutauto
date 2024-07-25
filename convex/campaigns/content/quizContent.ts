import OpenAI from "openai";
import { callOpenAI } from "./openAIService";

//place in helper file
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  preferences?: string[];
  instagramHandle?: string;
  twitterHandle?: string;
  tiktokHandle?: string;
  location?: string;
}

//place in helper file
export interface BrandData {
  name: string;
  description: string;
  products?: string[];
  // Add any other relevant brand information
}

interface QuizContent {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  reward: string;
}

export async function generateQuizContent(
  customerData: CustomerData,
  brandData: BrandData,
): Promise<QuizContent> {
  const messages = createQuizPrompt(customerData, brandData);

  const generatedContent = await callOpenAI<QuizContent>(
    messages,
    "generateQuizContent",
  );
  return generatedContent;
}

function createQuizPrompt(
  customerData: CustomerData,
  brandData: BrandData,
): Array<OpenAI.Chat.ChatCompletionMessageParam> {
  return [
    {
      role: "system",
      content:
        "You are an AI assistant that creates engaging content for marketing campaigns. The goal, is to be simple, sticky and follow sound marketing principles. Return the quiz in json format",
    },
    {
      role: "user",
      content: `
Create an engaging  question for ${customerData.firstName} about ${brandData.name}.

Customer Preferences: ${customerData.preferences?.join(", ") || "Not specified"}
Brand Description: ${brandData.description}
Brand Products: ${brandData.products?.join(", ") || "Not specified"}

The question should be fun, relevant to the brand's products, and tailored to the customer's preferences if available.
It should be witty.
The question should be such that all the answers are correct. It's not meant to be taken too seriously.


Please generate the following:
1. A question related to the brand or its products
2. Three possible answer options
3. The correct answer
4. A brief explanation of why the answer is correct
5. A reward or special that uses some imagery or pun related to the answer, question or brand

Provide the response in a JSON format with the following structure:
{
  "question": "...",
  "options": ["...", "...", "..."],
  "correctAnswer": "...",
  "explanation": "...",
  "reward": "..."
}
    `,
    },
  ];
}
