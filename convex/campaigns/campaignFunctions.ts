import { mutation, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { getCurrentUserAndOrganization } from "../accessControlHelpers";
import {
  logActivityHelper,
  logInternalActivity,
} from "../activities/activityHelpers";
import { ActivityTypes } from "../activities/activityHelpers";
import { Platform } from "./campaignActionHelpers";

export const generateCampaign = mutation({
  args: {
    customerId: v.id("customers"),
    title: v.string(),
    contentTypes: v.array(
      v.union(
        v.literal("quiz"),
        v.literal("fact"),
        v.literal("myth"),
        v.literal("general"),
        v.literal("custom"),
      ),
    ),
    platforms: v.array(
      v.union(
        v.literal("igReels"),
        v.literal("tiktokVideo"),
        v.literal("igPost"),
        v.literal("twitterPost"),
        v.literal("email"),
      ),
    ),
    backgroundInstructions: v.optional(v.string()),
    aiInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    if (!user || !user.canvaAccessToken) {
      throw new Error("User not found or Canva not connected");
    }

    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    //remember to adjust whenever a new field is added to customer
    const {
      _id,
      _creationTime,
      createdAt,
      phone,
      updatedAt,
      campaigns,
      organizationId,
      userId,
      ...customerData
    } = customer;

    console.log(
      `Starting campaign generation for customer: ${customer.firstName} ${customer.lastName}`,
    );

    const contentTypes = ["quiz", "myth"];
    const platforms: Platform[] = ["tiktokVideo"];
    try {
      await ctx.scheduler.runAfter(
        0,
        internal.campaigns.campaignActions.generateCampaignAction,
        {
          customerId: args.customerId,
          customerData,
          userId: user._id,
          organizationId: organization._id,
          contentTypes: args.contentTypes,
          platforms: args.platforms,
          title:
            args.title + " - " + customer.firstName + " " + customer.lastName,
        },
      );

      return { message: "Campaign generation started" };
    } catch (error) {
      console.error("Failed to start campaign generation:", error);

      throw new Error("Failed to start campaign generation. Please try again.");
    }
  },
});

export const generateCampaigns = mutation({
  args: {
    customerIds: v.array(v.id("customers")),
    title: v.string(),
    contentTypes: v.array(
      v.union(
        v.literal("quiz"),
        v.literal("fact"),
        v.literal("myth"),
        v.literal("general"),
        v.literal("custom"),
      ),
    ),
    platforms: v.array(
      v.union(
        v.literal("igReels"),
        v.literal("tiktokVideo"),
        v.literal("igPost"),
        v.literal("twitterPost"),
        v.literal("email"),
      ),
    ),
    backgroundInstructions: v.optional(v.string()),
    aiInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    if (!user || !user.canvaAccessToken) {
      throw new Error(
        "Canva not connected. Try disconnecting from Canva and reconnecting from the dashboard.",
      );
    }

    const batchSize = 10;
    let successCount = 0;
    let failureCount = 0;

    // Process customers in batches
    for (let i = 0; i < args.customerIds.length; i += batchSize) {
      const batch = args.customerIds.slice(i, i + batchSize);

      const batchPromises = batch.map(async (customerId) => {
        try {
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
            organizationId,
            userId,
            ...customerData
          } = customer;

          console.log(
            `Starting campaign generation for customer: ${customer.firstName} ${customer.lastName}`,
          );
          console.log(
            "Part of batch:",
            Math.floor(i / batchSize) + 1,
            "of",
            Math.ceil(args.customerIds.length / batchSize),
          );

          // Schedule the campaign generation action

          await ctx.scheduler.runAfter(
            5000, // 5 seconds to help with rate limiting
            internal.campaigns.campaignActions.generateCampaignAction,
            {
              customerId,
              customerData,
              userId: user._id,
              organizationId: organization._id,
              contentTypes: args.contentTypes,
              platforms: args.platforms,
              title:
                args.title +
                " - " +
                customer.firstName +
                " " +
                customer.lastName,
            },
          );

          successCount++;
        } catch (error) {
          failureCount++;
          console.error(
            `Failed to generate campaign for customer ${customerId}: ${(error as Error).message}`,
            error,
          );
        }
      });

      await Promise.all(batchPromises);
    }

    // Log the bulk campaign creation
    await logActivityHelper(
      ctx,
      user,
      organization,
      ActivityTypes.BULK_CAMPAIGN_CREATED,
      {
        totalCampaigns: args.customerIds.length.toString(),
        successCount: successCount.toString(),
        failureCount: failureCount.toString(),
      },
    );

    return {
      message: "Bulk campaign generation process completed",
      totalCampaigns: args.customerIds.length,
      successCount,
      failureCount,
    };
  },
});

export const saveCampaignResults = internalMutation({
  args: {
    customerId: v.id("customers"),
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    customerName: v.string(),
    title: v.string(),
    results: v.array(
      v.object({
        platform: v.string(),
        jobId: v.string(),
        status: v.string(),
        title: v.string(),
        type: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { customerId, results } = args;

    const campaignId = await ctx.db.insert("campaigns", {
      customerId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "in_progress",
      platforms: results.map((r) => r.platform),
      userId: args.userId,
      organizationId: args.organizationId,
      title: args.title,
    });

    await logInternalActivity(
      ctx,
      args.userId,
      args.organizationId,
      ActivityTypes.CAMPAIGN_CREATED,
      {
        campaignName: `${args.customerName}'s Full Package`,
        itemId: campaignId,
      },
    );

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
        type: result.type,
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
