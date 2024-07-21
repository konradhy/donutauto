import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { callCanvaAutofillAPI } from "../canvaApi";

export const DEFAULT_TEMPLATE_IDS = {
  EMAIL: "DAGKfYlVZgQ",
  INSTAGRAM: "DAGKfYlVZgQ",
  TWITTER: "DAGKfYlVZgQ",
  TIKTOK: "DAGKfYlVZgQ",
};

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
  },
  handler: async (ctx, args) => {
    const { customerId, userId, customerData } = args;
    const results = [];

    let canvaAccessToken;
    try {
      canvaAccessToken = await ctx.runAction(
        internal.accessTokenHelperAction.getCanvaAccessToken,
        { userId },
      );
    } catch (error) {
      console.error("Failed to get Canva access token:", error);
      throw new Error(
        "Unable to access Canva. Please ensure your Canva account is connected.",
      );
    }

    // Fetch custom template settings
    const templateSettings = await ctx.runQuery(
      internal.brandTemplateSettings.getBrandTemplateSettingsInternal,
      { userId },
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

    // Helper function to generate a title
    const generateTitle = (platform: string) => {
      return `${platform.charAt(0).toUpperCase() + platform.slice(1)} Campaign - ${customerData.firstName} ${customerData.lastName} - User:${userId} Customer:${customerId}`;
    };

    try {
      // EMAIL
      const emailTemplateId = getTemplateId("EMAIL");
      const emailTitle = generateTitle("email");
      const emailResult = await callCanvaAutofillAPI(
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
        emailTitle,
      );
      results.push({
        platform: "email",
        jobId: emailResult.job.id,
        status: emailResult.job.status,
        title: emailTitle,
        type: "general",
      });

      // IG

      if (customerData.instagramHandle) {
        const firstPreference = customerData.preferences?.[0];

        const instagramTemplateId = getTemplateId("INSTAGRAM");
        const instagramTitle = generateTitle("instagram");
        const instagramResult = await callCanvaAutofillAPI(
          instagramTemplateId as string,
          {
            firstName: { type: "text", text: customerData.firstName },
            instagramHandle: {
              type: "text",
              text: customerData.instagramHandle,
            },
            preferences: {
              type: "text",
              text: `made for all my ${firstPreference || "vanilla"} lovers`,
            },
          },
          canvaAccessToken,
          instagramTitle,
        );
        results.push({
          platform: "instagram",
          jobId: instagramResult.job.id,
          status: instagramResult.job.status,
          title: instagramTitle,
          type: "general",
        });
      }

      // TWITTER
      if (customerData.twitterHandle) {
        const twitterTemplateId = getTemplateId("TWITTER");
        const twitterTitle = generateTitle("twitter");
        const twitterResult = await callCanvaAutofillAPI(
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
          twitterTitle,
        );
        results.push({
          platform: "twitter",
          jobId: twitterResult.job.id,
          status: twitterResult.job.status,
          title: twitterTitle,
          type: "general",
        });
      }

      // TIKTOK
      if (customerData.tiktokHandle) {
        const tiktokTemplateId = getTemplateId("TIKTOK");
        const tiktokTitle = generateTitle("tiktok");

        //seemed to work fine. Issues however with the actual content and the fact that the input is static
        const quizContent = await ctx.runAction(
          internal.aiGeneration.text.generateQuizContent,
          {
            brandName: "AutoDonut", // Replace with actual brand name
            brandDescription:
              "DonutAuto is a cutting-edge automated marketing platform specializing in the food and beverage        industry, with a particular focus on donut shops and bakeries. We combine AI-driven content generation with Canva's design capabilities to create personalized, mouth-watering marketing campaigns that help small to medium-sized donut businesses increase their online presence and customer engagement. Our platform streamlines the creation of eye-catching social media posts, email campaigns, and digital ads, allowing donut shop owners to focus on what they do best - creating delicious treats. With DonutAuto, every sprinkle, glaze, and filling gets the attention it deserves in the digital world", // Replace with actual description
            preferences: customerData.preferences || [],
            location: customerData.location || "",
            firstName: customerData.firstName,
          },
        );

        const tiktokResult = await callCanvaAutofillAPI(
          tiktokTemplateId as string,
          {
            firstName: {
              type: "text",
              text: `Hey ${customerData.firstName} if you get this question right you'll get:`,
            },
            handle: { type: "text", text: customerData.tiktokHandle },
            preferences: {
              type: "text",
              text: customerData.preferences?.[0] || "",
            },
            deal: {
              type: "text",
              text: quizContent.deal,
            },
            question: {
              type: "text",
              text: quizContent.question,
            },
            answerOne: {
              type: "text",
              text: quizContent.answerOne,
            },
            answerTwo: {
              type: "text",
              text: quizContent.answerTwo,
            },
            answerThree: {
              type: "text",
              text: quizContent.answerThree,
            },
          },
          canvaAccessToken,
          tiktokTitle,
        );

        results.push({
          platform: "tiktok",
          jobId: tiktokResult.job.id,
          status: tiktokResult.job.status,
          title: tiktokTitle,
          type: "quiz",
        });
      }
    } catch (error) {
      console.error("Error generating campaign:", error);
      throw new Error("Failed to generate campaign. Please try again later.");
    }

    await ctx.runMutation(
      internal.campaigns.campaignFunctions.saveCampaignResults,
      {
        customerId,
        results,
        userId,
        organizationId: args.organizationId,
        customerName: `${customerData.firstName} `,
        title: args.title,
      },
    );

    console.log(
      `Campaign generation initiated for customer: ${customerData.firstName} ${customerData.lastName}`,
    );

    return results;
  },
});

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
