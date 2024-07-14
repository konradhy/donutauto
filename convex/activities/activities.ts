import { v } from "convex/values";
import { internalMutation, query } from "../_generated/server";
import { getCurrentUserAndOrganization } from "../accessControlHelpers";

export const logActivity = internalMutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    action: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activities", {
      userId: args.userId,
      organizationId: args.organizationId,
      action: args.action,
      details: args.details,
    });
  },
});


// convex/activities.ts


export const getRecentActivities = query({
  args: {},
  handler: async (ctx) => {

        const { organization,  } = await getCurrentUserAndOrganization(ctx);
        const activities = await ctx.db
      .query("activities")
      .withIndex("by_organization", (q) => q.eq("organizationId", organization._id))
      .order("desc")
      .take(20);

      if (!activities) {
        throw new Error("Activities not found");
      }
    

    return activities;
  },
});