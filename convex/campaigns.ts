import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { getCurrentUserAndOrganization } from "./accessControlHelpers";

export const generateCampaign = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    // Check if the user is authenticated

    const { organization, user } = await getCurrentUserAndOrganization(ctx);

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
    //TODO: if this fails we should throw an error to the ui
    await ctx.scheduler.runAfter(
      0,
      internal.campaignActions.generateCampaignAction,
      {
        customerId: args.customerId,
        customerData,
        userId: user._id,
        organizationId: organization._id,
      },
    );

    return { message: "Campaign generation started" };
  },
});

export const saveCampaignResults = internalMutation({
  args: {
    customerId: v.id("customers"),
    userId: v.id("users"),
    organizationId: v.id("organizations"),
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
      userId: args.userId,
      organizationId: args.organizationId,
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
        userId: args.userId,
        organizationId: args.organizationId,
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

export const generateCampaigns = mutation({
  args: { customerIds: v.array(v.id("customers")) },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    // Fetch the user data to get the Canva access token

    if (!user || !user.canvaAccessToken) {
      throw new Error(" Canva not connected");
    }

    // Hardcoded batch size
    const batchSize = 10;

    // Process customers in batches
    for (let i = 0; i < args.customerIds.length; i += batchSize) {
      const batch = args.customerIds.slice(i, i + batchSize);

      const batchPromises = batch.map(async (customerId) => {
        // Fetch the customer data
        const customer = await ctx.db.get(customerId);
        if (!customer) {
          throw new Error(`Customer with ID ${customerId} not found`);
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
        console.log(
          "Part of batch:",
          i / batchSize + 1,
          "of",
          Math.ceil(args.customerIds.length / batchSize),
        );

        // Schedule the campaign generation action
        await ctx.scheduler.runAfter(
          0,
          internal.campaignActions.generateCampaignAction,
          {
            customerId,
            customerData,
            userId: user._id,
            organizationId: organization._id,
          },
        );
      });

      await Promise.all(batchPromises);
    }

    return { message: "Campaign generation started for all customers" };
  },
});
