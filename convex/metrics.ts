import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserAndOrganization } from "./accessControlHelpers";

// Define the possible platforms and types
const platforms = ["twitter", "instagram", "email"] as const;
type Platform = (typeof platforms)[number];

const designTypes = ["general", "custom", "quiz", "joke", "coupon"] as const;
type DesignType = (typeof designTypes)[number];

export const getMetrics = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const customers = await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter(
        (q) =>
          q.gte(q.field("_creationTime"), args.startDate) &&
          q.lt(q.field("_creationTime"), args.endDate),
      )
      .collect();

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter(
        (q) =>
          q.gte(q.field("_creationTime"), args.startDate) &&
          q.lt(q.field("_creationTime"), args.endDate),
      )
      .collect();

    const designs = await ctx.db
      .query("designs")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter(
        (q) =>
          q.gte(q.field("_creationTime"), args.startDate) &&
          q.lt(q.field("_creationTime"), args.endDate),
      )
      .collect();

    // Initialize design metrics
    const designMetrics = {
      totalDesigns: 0,
      byPlatform: Object.fromEntries(platforms.map((p) => [p, 0])) as Record<
        Platform,
        number
      >,
      byType: Object.fromEntries(designTypes.map((t) => [t, 0])) as Record<
        DesignType,
        number
      >,
    };

    // Calculate design metrics
    for (const design of designs) {
      designMetrics.totalDesigns++;
      if (platforms.includes(design.platform as Platform)) {
        designMetrics.byPlatform[design.platform as Platform]++;
      }
      if (designTypes.includes(design.type as DesignType)) {
        designMetrics.byType[design.type as DesignType]++;
      }
    }

    return {
      customerCount: customers.length,
      campaignCount: campaigns.length,
      ...designMetrics,
    };
  },
});
