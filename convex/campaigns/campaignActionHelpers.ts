import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { callCanvaAutofillAPI } from "../canvaApi";
import { generateContent } from "./content/contentGenerator";

export const DEFAULT_TEMPLATE_IDS = {
  EMAIL: "DAGKfYlVZgQ",
  INSTAGRAM: "DAGKfYlVZgQ",
  TWITTER: "DAGKfYlVZgQ",
  TIKTOK: "DAGKfYlVZgQ",
};

export type Platform = "email" | "instagram" | "twitter" | "tiktok";
export type ContentType =
  | "quiz"
  | "fact"
  | "myth"
  | "general"
  | "joke"
  | "custom";

export async function initializeCanvaConnection(
  ctx: any,
  userId: Id<"users">,
): Promise<string> {
  try {
    return await ctx.runAction(
      internal.accessTokenHelperAction.getCanvaAccessToken,
      { userId },
    );
  } catch (error) {
    console.error("Failed to get Canva access token:", error);
    throw new Error(
      "Unable to access Canva. Please ensure your Canva account is connected.",
    );
  }
}

export async function getTemplateSettings(ctx: any, userId: Id<"users">) {
  return await ctx.runQuery(
    internal.brandTemplateSettings.getBrandTemplateSettingsInternal,
    { userId },
  );
}

export function getTemplateId(
  templateSettings: any,
  platform: Platform,
): string {
  if (templateSettings) {
    const customId =
      templateSettings[
        `${platform.toLowerCase()}TemplateId` as keyof typeof templateSettings
      ];
    return (
      customId ||
      DEFAULT_TEMPLATE_IDS[
        platform.toUpperCase() as keyof typeof DEFAULT_TEMPLATE_IDS
      ]
    );
  }
  return DEFAULT_TEMPLATE_IDS[
    platform.toUpperCase() as keyof typeof DEFAULT_TEMPLATE_IDS
  ];
}

export function generateTitle(
  platform: string,
  customerData: any,
  userId: Id<"users">,
  customerId: Id<"customers">,
  campaignTitle: string,
): string {
  return `${platform.charAt(0).toUpperCase() + platform.slice(1)} Design - ${customerData.firstName} ${customerData.lastName} - for the ${campaignTitle} Campaign`;
}

export async function generateContentForPlatform(
  contentType: ContentType,
  platform: Platform,
  customerData: any,
  brandData: any,
): Promise<any> {
  return await generateContent(contentType, platform, customerData, brandData);
}

export async function callCanvaAPI(
  accessToken: string,
  templateId: string,
  content: any,
  title: string,
) {
  console.log("Calling Canva API with content:", content);

  return await callCanvaAutofillAPI(templateId, content, accessToken, title);
}

export function isValidPlatform(
  platform: Platform,
  customerData: any,
): boolean {
  switch (platform) {
    case "instagram":
      return !!customerData.instagramHandle;
    case "twitter":
      return !!customerData.twitterHandle;
    case "tiktok":
      return !!customerData.tiktokHandle;
    default:
      return true;
  }
}

export function formatContent(
  contentType: ContentType,
  platform: Platform,
  customerData: any,
  content: any,
) {
  switch (contentType) {
    case "quiz":
      return {
        firstName: {
          type: "text",
          text: `Hey ${customerData.firstName} if you get this question right you'll get:`,
        },
        handle: { type: "text", text: getHandle(platform, customerData) },
        preferences: {
          type: "text",
          text: customerData.preferences?.[0] || "",
        },
        deal: { type: "text", text: content.reward },
        question: { type: "text", text: content.question },
        answerOne: { type: "text", text: content.options[0] },
        answerTwo: { type: "text", text: content.options[1] },
        answerThree: { type: "text", text: content.options[2] },
      };
    case "myth":
      return {
        mythOne: { type: "text", text: content.mythOne },
        brand: { type: "text", text: customerData.brandName || "AutoDonut" },
        mythTwo: { type: "text", text: content.mythTwo },
        deal: { type: "text", text: content.deal },
        factTwo: { type: "text", text: content.factTwo },
        factOne: { type: "text", text: content.factOne },
        handle: {
          type: "text",
          text: customerData[`${platform}Handle`] || customerData.email || "",
        },
      };

    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

function getHandle(platform: Platform, customerData: any): string {
  switch (platform) {
    case "instagram":
      return customerData.instagramHandle || "";
    case "twitter":
      return customerData.twitterHandle || "";
    case "tiktok":
      return customerData.tiktokHandle || "";
    case "email":
      return customerData.email;
    default:
      return "";
  }
}
