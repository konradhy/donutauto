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
    templates: v.object({
      quiz: v.object({
        igReels: v.optional(v.string()),
        tiktokVideo: v.optional(v.string()),
        igPost: v.optional(v.string()),
        twitterPost: v.optional(v.string()),
      }),
      fact: v.object({
        igReels: v.optional(v.string()),
        tiktokVideo: v.optional(v.string()),
        igPost: v.optional(v.string()),
        twitterPost: v.optional(v.string()),
      }),
      general: v.object({
        igReels: v.optional(v.string()),
        tiktokVideo: v.optional(v.string()),
        igPost: v.optional(v.string()),
        twitterPost: v.optional(v.string()),
      }),
      myth: v.object({
        igReels: v.optional(v.string()),
        tiktokVideo: v.optional(v.string()),
        igPost: v.optional(v.string()),
        twitterPost: v.optional(v.string()),
      }),
      custom: v.object({
        igReels: v.optional(v.string()),
        tiktokVideo: v.optional(v.string()),
        igPost: v.optional(v.string()),
        twitterPost: v.optional(v.string()),
      }),
    }),
    emailTemplateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    const existingSettings = await ctx.db
      .query("brandTemplateSettings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args);
    } else {
      await ctx.db.insert("brandTemplateSettings", {
        userId: user._id,
        organizationId: organization._id,
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

    return settings;
  },
});
