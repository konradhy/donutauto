import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Stores or updates the Canva access token for a user.
 * This should be called after successful Canva authentication.
 */

//an arg will be the identity token.
export const storeAccessToken = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresIn: v.optional(v.number()),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const now = Date.now();
    const updateData: any = {
      canvaAccessToken: args.accessToken,
      isCanvaConnected: true,
      lastCanvaTokenUpdate: now,
    };

    if (args.refreshToken) {
      updateData.canvaRefreshToken = args.refreshToken;
    }

    if (args.expiresIn) {
      updateData.canvaTokenExpiration = now + args.expiresIn * 1000;
    }

    await ctx.db.patch(user._id, updateData);
  },
});

/**
 * Retrieves the Canva access token for the current user.
 */
export const getAccessToken = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user || !user.canvaAccessToken) {
      throw new ConvexError("Canva access token not found");
    }

    return {
      accessToken: user.canvaAccessToken,
      refreshToken: user.canvaRefreshToken,
      expiration: user.canvaTokenExpiration,
    };
  },
});

export const isConnected = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      return false;
    }

    return user.isCanvaConnected;
  },
});

export const getRefreshToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user.canvaRefreshToken;
  },
});

export const updateCanvaConnectionStatus = mutation({
  args: {
    tokenIdentifier: v.string(),
    isConnected: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      isCanvaConnected: args.isConnected,
      canvaAccessToken: args.isConnected ? user.canvaAccessToken : undefined,
      canvaRefreshToken: args.isConnected ? user.canvaRefreshToken : undefined,
      canvaTokenExpiration: args.isConnected
        ? user.canvaTokenExpiration
        : undefined,
    });

    return { success: true };
  },
});

//Rethink this
export const getAccessTokenWithTokenIdentifier = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .first();

    if (!user || !user.canvaAccessToken) {
      throw new ConvexError("Canva access token not found");
    }

    return {
      accessToken: user.canvaAccessToken,
      refreshToken: user.canvaRefreshToken,
      expiration: user.canvaTokenExpiration,
    };
  },
});
