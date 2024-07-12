// convex/brandTemplateSettings.ts

import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserAndOrganization } from "./accessControlHelpers";

//for your personal settings
export const getBrandTemplateSettings = query({
  handler: async (ctx) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    //this way you get your own settings
    const settings = await ctx.db
      .query("brandTemplateSettings")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    return settings || null;
  },
});

//for the organization settings
export const getBrandTemplateSettingsOrg = query({
  handler: async (ctx) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const settings = await ctx.db
      .query("brandTemplateSettings")
      .filter((q) => q.eq(q.field("organizationId"), organization._id))
      .unique();

    return settings || null;
  },
});

//updates your personal settings
export const updateBrandTemplateSettings = mutation({
  args: {
    emailTemplateId: v.optional(v.string()),
    instagramTemplateId: v.optional(v.string()),
    twitterTemplateId: v.optional(v.string()),
    tiktokTemplateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

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
        organizationId: organization._id,
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
