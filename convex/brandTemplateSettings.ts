// convex/brandTemplateSettings.ts

import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBrandTemplateSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const settings = await ctx.db
      .query("brandTemplateSettings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    return settings || null;
  },
});

export const updateBrandTemplateSettings = mutation({
  args: {
    emailTemplateId: v.optional(v.string()),
    instagramTemplateId: v.optional(v.string()),
    twitterTemplateId: v.optional(v.string()),
    tiktokTemplateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const existingSettings = await ctx.db
      .query("brandTemplateSettings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args);
    } else {
      await ctx.db.insert("brandTemplateSettings", {
        userId: user._id,
        ...args,
      });
    }
  },
});

export const getBrandTemplateSettingsInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("brandTemplateSettings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    console.log("Retrieved template settings:", settings); // For debugging
    return settings;
  },
});
