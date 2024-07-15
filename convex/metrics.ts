import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserAndOrganization } from "./accessControlHelpers";

const platforms = ["twitter", "instagram", "email"] as const;
type Platform = (typeof platforms)[number];

const designTypes = ["general", "custom", "quiz", "joke", "coupon"] as const;
type DesignType = (typeof designTypes)[number];

export const getMetrics = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const customersPromise = ctx.db
      .query("customers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter((q) => {
        const dateFilter = q.and(
          q.gte(q.field("_creationTime"), args.startDate),
          q.lt(q.field("_creationTime"), args.endDate),
        );
        return args.userId
          ? q.and(dateFilter, q.eq(q.field("userId"), args.userId))
          : dateFilter;
      })
      .collect();

    const campaignsPromise = ctx.db
      .query("campaigns")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter((q) => {
        const dateFilter = q.and(
          q.gte(q.field("_creationTime"), args.startDate),
          q.lt(q.field("_creationTime"), args.endDate),
        );
        return args.userId
          ? q.and(dateFilter, q.eq(q.field("userId"), args.userId))
          : dateFilter;
      })
      .collect();

    const designsPromise = ctx.db
      .query("designs")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter((q) => {
        const dateFilter = q.and(
          q.gte(q.field("_creationTime"), args.startDate),
          q.lt(q.field("_creationTime"), args.endDate),
        );
        return args.userId
          ? q.and(dateFilter, q.eq(q.field("userId"), args.userId))
          : dateFilter;
      })
      .collect();

    const [customers, campaigns, designs] = await Promise.all([
      customersPromise,
      campaignsPromise,
      designsPromise,
    ]);

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
