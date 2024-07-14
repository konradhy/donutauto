import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

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
