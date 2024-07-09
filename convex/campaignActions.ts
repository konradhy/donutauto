// convex/campaignActions.ts

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { callCanvaAPI } from "./canvaApi";

export const TEMPLATE_IDS = {
  EMAIL: "DAGKfYlVZgQ",
  INSTAGRAM: "DAGKfYlVZgQ",
  TWITTER: "yDAGKfYlVZgQ",
  TIKTOK: "DAGKfYlVZgQ",
};

export const generateCampaignAction = internalAction({
  args: {
    customerId: v.id("customers"),
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

    try {
      /*
The core of the app. We just create a bunch of designs here. 
Forget the "coupon idea" they are all coupons. So all of them have a unique coupon code being sent in the brand template.

Topics to explore:
1. AI createing designs that are fun facts about donuts, the customer preferences and a trending topic in the customer's location.
2. Same as above but are tips
2. AI Generates a background image for some of them 
3. Include a QR code on some of the designs 
4. One where you can upload the customer's logo or photo
5. Include the companies logo as a watermark on some
6. Quiz based designs 

I need a system to make it easy for me to add a design type.

*/

      const emailData = {
        first_name: { type: "text", text: customerData.firstName },
        last_name: { type: "text", text: customerData.lastName },
        email: { type: "text", text: customerData.email },
        preferences: {
          type: "text",
          text: customerData.preferences?.join(", ") || "",
        },
      };

      const emailResult = await callCanvaAPI(
        TEMPLATE_IDS.EMAIL,
        emailData,
        canvaAccessToken,
        `Email Campaign for ${customerData.firstName} ${customerData.lastName}`,
      );
      results.push({ platform: "email", ...emailResult });
    } catch (error) {
      console.error("Error generating email campaign:", error);
    }

    if (customerData.instagramHandle) {
      try {
        const instagramData = {
          first_name: { type: "text", text: customerData.firstName },
          instagram_handle: {
            type: "text",
            text: customerData.instagramHandle,
          },
          preferences: {
            type: "text",
            text: customerData.preferences?.join(", ") || "",
          },
        };

        const instagramResult = await callCanvaAPI(
          TEMPLATE_IDS.INSTAGRAM,
          instagramData,
          canvaAccessToken,
          `Instagram Campaign for ${customerData.firstName} ${customerData.lastName}`,
        );
        results.push({ platform: "instagram", ...instagramResult });
      } catch (error) {
        console.error("Error generating Instagram campaign:", error);
      }
    }

    // Similar blocks for Twitter and TikTok...

    // Save the results
    // await ctx.runMutation(internal.campaigns.saveCampaignResults, {
    //   customerId,
    //   results,
    // });

    console.log(
      `Campaign generation completed for customer: ${customerData.firstName} ${customerData.lastName}`,
    );
  },
});
