import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

import { ContentType, Platform } from "./campaignActionHelpers";
import { initializeCanvaConnection } from "./campaignActionHelpers";
import { getTemplateSettings } from "./campaignActionHelpers";
import { getTemplateId } from "./campaignActionHelpers";
import { generateTitle } from "./campaignActionHelpers";
import { generateContentForPlatform } from "./campaignActionHelpers";
import { callCanvaAPI } from "./campaignActionHelpers";
import { isValidPlatform } from "./campaignActionHelpers";
import { formatContent } from "./campaignActionHelpers";

export const generateCampaignAction = internalAction({
  args: {
    customerId: v.id("customers"),
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    title: v.string(),
    customerData: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      dob: v.optional(v.string()),
      preferences: v.optional(v.array(v.string())),
      instagramHandle: v.optional(v.string()),
      twitterHandle: v.optional(v.string()),
      tiktokHandle: v.optional(v.string()),
      location: v.optional(v.string()),
    }),
    contentTypes: v.array(v.string()),
    platforms: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const {
      customerId,
      userId,
      customerData,
      contentTypes,
      platforms,
      organizationId,
    } = args;
    const results = [];

    const canvaAccessToken = await initializeCanvaConnection(ctx, userId);

    const templateSettings = await getTemplateSettings(ctx, userId);

    for (const contentType of contentTypes as ContentType[]) {
      for (const platform of platforms as Platform[]) {
        if (!isValidPlatform(platform, customerData)) continue;

        //add type-safety for content later
        const content = await generateContentForPlatform(
          contentType,
          platform,
          customerData,
          {
            name: "AutoDonut", // Hardcoded for now
            description:
              "Customizable Donuts with sprinkles, fillings, sauce, marshmallows and more",
          },
        );
        let templateId = getTemplateId(templateSettings, platform);
        const title = generateTitle(
          platform,
          customerData,
          userId,
          customerId,
          args.title,
        );

        //Then I'll just go over it slowly and make notes
        //then implement  the myth type and the UI. no need for api, i can just add the string to the array for types where it is currently hard coded

        const formattedContent = formatContent(
          contentType,
          platform,
          customerData,
          content,
        );

        //do this better later
        if (contentType === "myth") {
          templateId = "DAGLh9LXWSk";
        }

        const result = await callCanvaAPI(
          canvaAccessToken,
          templateId,
          formattedContent,
          title,
        );

        results.push({
          platform,
          jobId: result.job.id,
          status: result.job.status,
          title,
          type: contentType,
        });
      }
    }

    await saveCampaignResults(
      ctx,
      customerId,
      results,
      userId,
      organizationId,
      customerData,
      args.title,
    );

    console.log(
      `Campaign generation initiated for customer: ${customerData.firstName} ${customerData.lastName}`,
    );

    return results;
  },
});

export async function saveCampaignResults(
  ctx: any,
  customerId: Id<"customers">,
  results: any[],
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  customerData: any,
  title: string,
) {
  await ctx.runMutation(
    internal.campaigns.campaignFunctions.saveCampaignResults,
    {
      customerId,
      results,
      userId,
      organizationId,
      customerName: `${customerData.firstName} ${customerData.lastName}`,
      title,
    },
  );
}

export const checkAutofillJob = internalAction({
  args: {
    userId: v.id("users"),
    designId: v.id("designs"),
    jobId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, designId, jobId } = args;
    console.log(`Checking autofill job: ${jobId}`);

    // Get Canva access token
    const accessToken = await ctx.runAction(
      internal.accessTokenHelperAction.getCanvaAccessToken,
      { userId },
    );

    // Make API request to Canva
    const response = await fetch(
      `https://api.canva.com/rest/v1/autofills/${jobId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Canva API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.job.status === "success") {
      // Update design in database
      console.log(data.job.result);
      await ctx.runMutation(
        internal.campaigns.designs.updateDesignAfterAutofill,
        {
          designId,
          canvaDesignId: data.job.result.design.id,
          editUrl: data.job.result.design.url,
          viewUrl: data.job.result.design.url.replace("/edit", "/view"),
          thumbnailUrl: data.job.result.design.thumbnail.url,
        },
      );
      return { status: "completed" };
    } else if (data.job.status === "failed") {
      return { status: "failed", error: data.job.error.message };
    } else {
      // Job still in progress
      return { status: "in_progress" };
    }
  },
});
