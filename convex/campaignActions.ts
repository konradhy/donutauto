// convex/campaignActions.ts

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { callCanvaAPI } from "./canvaApi";

export const DEFAULT_TEMPLATE_IDS = {
  EMAIL: "DAGKfYlVZgQ",
  INSTAGRAM: "DAGKfYlVZgQ",
  TWITTER: "yDAGKfYlVZgQ",
  TIKTOK: "DAGKfYlVZgQ",
};

export const generateCampaignAction = internalAction({
  args: {
    customerId: v.id("customers"),
    userId: v.id("users"),
    customerData: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      dob: v.optional(v.string()),
      preferences: v.optional(v.array(v.string())),
      instagramHandle: v.optional(v.string()),
      twitterHandle: v.optional(v.string()),
      tiktokHandle: v.optional(v.string()),
    }),
    canvaAccessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { customerId, customerData, canvaAccessToken } = args;
    const results = [];

    // Fetch custom template settings
    const templateSettings = await ctx.runQuery(
      internal.brandTemplateSettings.getBrandTemplateSettingsInternal,
      {
        userId: args.userId,
      },
    );

    // Helper function to get the appropriate template ID
    const getTemplateId = (platform: keyof typeof DEFAULT_TEMPLATE_IDS) => {
      if (templateSettings) {
        const customId =
          templateSettings[
            `${platform.toLowerCase()}TemplateId` as keyof typeof templateSettings
          ];
        return customId || DEFAULT_TEMPLATE_IDS[platform];
      }
      return DEFAULT_TEMPLATE_IDS[platform];
    };

    try {
      // Generate email campaign
      const emailTemplateId = getTemplateId("EMAIL");
      const emailResult = await callCanvaAPI(
        emailTemplateId as string,
        {
          firstName: { type: "text", text: customerData.firstName },
          lastName: { type: "text", text: customerData.lastName },
          email: { type: "text", text: customerData.email },
          preferences: {
            type: "text",
            text: customerData.preferences?.join(", ") || "",
          },
        },
        canvaAccessToken,
      );
      results.push({ platform: "email", job: emailResult.job });

      // Generate Instagram campaign if handle exists
      if (customerData.instagramHandle) {
        const instagramTemplateId = getTemplateId("INSTAGRAM");
        const instagramResult = await callCanvaAPI(
          instagramTemplateId as string,
          {
            firstName: { type: "text", text: customerData.firstName },
            instagramHandle: {
              type: "text",
              text: customerData.instagramHandle,
            },
            preferences: {
              type: "text",
              text: customerData.preferences?.join(", ") || "",
            },
          },
          canvaAccessToken,
        );
        results.push({ platform: "instagram", job: instagramResult.job });
      }

      // Generate Twitter campaign if handle exists
      if (customerData.twitterHandle) {
        const twitterTemplateId = getTemplateId("TWITTER");
        const twitterResult = await callCanvaAPI(
          twitterTemplateId as string,
          {
            firstName: { type: "text", text: customerData.firstName },
            twitterHandle: { type: "text", text: customerData.twitterHandle },
            preferences: {
              type: "text",
              text: customerData.preferences?.join(", ") || "",
            },
          },
          canvaAccessToken,
        );
        results.push({ platform: "twitter", job: twitterResult.job });
      }

      // Generate TikTok campaign if handle exists
      if (customerData.tiktokHandle) {
        const tiktokTemplateId = getTemplateId("TIKTOK");
        const tiktokResult = await callCanvaAPI(
          tiktokTemplateId as string,
          {
            firstName: { type: "text", text: customerData.firstName },
            tiktokHandle: { type: "text", text: customerData.tiktokHandle },
            preferences: {
              type: "text",
              text: customerData.preferences?.join(", ") || "",
            },
          },
          canvaAccessToken,
        );
        results.push({ platform: "tiktok", job: tiktokResult.job });
      }
    } catch (error) {
      console.error("Error generating campaign:", error);
    }

    // Save the results
    await ctx.runMutation(internal.campaigns.saveCampaignResults, {
      customerId,
      results,
    });

    console.log(
      `Campaign generation completed for customer: ${customerData.firstName} ${customerData.lastName}`,
    );
  },
});
