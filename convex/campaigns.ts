import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";

export const generateCampaign = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Fetch the user data to get the Canva access token
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user || !user.canvaAccessToken) {
      throw new Error("User not found or Canva not connected");
    }

    // Fetch the customer data
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const {
      _id,
      _creationTime,
      createdAt,
      phone,
      updatedAt,
      campaigns,
      ...customerData
    } = customer;

    console.log(
      `Starting campaign generation for customer: ${customer.firstName} ${customer.lastName}`,
    );

    // Schedule the campaign generation action
    await ctx.scheduler.runAfter(
      0,
      internal.campaignActions.generateCampaignAction,
      {
        customerId: args.customerId,
        customerData,
        canvaAccessToken: user.canvaAccessToken,
      },
    );

    return { message: "Campaign generation started" };
  },
});

// campaigns.ts

export const saveCampaignResults = internalMutation({
  args: {
    customerId: v.id("customers"),
    results: v.array(
      v.object({
        platform: v.string(),
        job: v.object({
          id: v.string(),
          status: v.string(),
          design: v.optional(
            v.object({
              id: v.string(),
              title: v.string(),
              url: v.string(),
            }),
          ),
        }),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { customerId, results } = args;

    // Create a new campaign
    const campaignId = await ctx.db.insert("campaigns", {
      customerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "in_progress",
      platforms: results.map((r) => r.platform),
    });

    // Save each job/design
    for (const result of results) {
      await ctx.db.insert("designs", {
        campaignId,
        customerId,
        platform: result.platform,
        jobId: result.job.id,
        designId: result.job.design?.id ?? "null",
        title: result.job.design?.title ?? `Design for ${result.platform}`,
        url: result.job.design?.url ?? "",
        status: "in_progress",

        updatedAt: Date.now(),
        thumbnailUrl: "",
      });
    }

    // Update customer with new campaign
    const customer = await ctx.db.get(customerId);
    const existingCampaigns = customer?.campaigns || [];
    await ctx.db.patch(customerId, {
      campaigns: [...existingCampaigns, campaignId],
    });

    return campaignId;
  },
});
// Add a new mutation to update the design status when the job is complete
export const updateDesignStatus = internalMutation({
  args: {
    jobId: v.string(),
    status: v.string(),
    thumbnailUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const design = await ctx.db
      .query("designs")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    if (design) {
      await ctx.db.patch(design._id, {
        status: args.status,
        thumbnailUrl: args.thumbnailUrl,
        updatedAt: Date.now(),
      });

      // If all designs in the campaign are complete, update campaign status
      const campaign = await ctx.db.get(design.campaignId);
      if (campaign) {
        const allDesigns = await ctx.db
          .query("designs")
          .filter((q) => q.eq(q.field("campaignId"), design.campaignId))
          .collect();

        const allComplete = allDesigns.every(
          (d) => d.status === "completed" || d.status === "failed",
        );
        if (allComplete) {
          await ctx.db.patch(design.campaignId, {
            status: "completed",
            updatedAt: Date.now(),
          });
        }
      }
    }
  },
});
