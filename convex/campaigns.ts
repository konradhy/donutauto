import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { title } from "process";

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

        userId: user._id,
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
        jobId: v.string(),
        status: v.string(),
        title: v.string(),
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

    // Save each job
    for (const result of results) {
      await ctx.db.insert("designs", {
        campaignId,
        customerId,
        platform: result.platform,
        jobId: result.jobId,
        status: result.status,
        updatedAt: Date.now(),
        title: result.title,
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
