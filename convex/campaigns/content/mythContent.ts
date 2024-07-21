import { callOpenAI } from "./openAIService";
import OpenAI from "openai";

interface CustomerData {
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

interface BrandData {
  name: string;
  description: string;
  products?: string[];
}

interface MythContent {
  mythOne: string;
  mythTwo: string;
  factOne: string;
  factTwo: string;
  deal: string;
}

export async function generateMythContent(
  customerData: CustomerData,
  brandData: BrandData,
): Promise<MythContent> {
  const messages = createMythPrompt(customerData, brandData);
  const generatedContent = await callOpenAI<MythContent>(
    messages,
    "generateMythContent",
  );
  return generatedContent;
}

function createMythPrompt(
  customerData: CustomerData,
  brandData: BrandData,
): Array<OpenAI.Chat.ChatCompletionMessageParam> {
  return [
    {
      role: "system",
      content:
        "You are an AI assistant that creates engaging myth-busting content for marketing campaigns. Return the content in JSON format.",
    },
    {
      role: "user",
      content: `
Create myth-busting content for ${customerData.firstName} about ${brandData.name}.

Customer Preferences: ${customerData.preferences?.join(", ") || "Not specified"}
Brand Description: ${brandData.description}
Brand Products: ${brandData.products?.join(", ") || "Not specified"}

Please generate the following:
1. Two myths related to the brand or its products
2. Two facts that bust these myths
3. A special deal or offer related to the facts

Provide the response in a JSON format with the following structure:
{
  "mythOne": "...",
  "mythTwo": "...",
  "factOne": "...",
  "factTwo": "...",
  "deal": "..."
}
    `,
    },
  ];
}
