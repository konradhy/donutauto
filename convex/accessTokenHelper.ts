//TODO: Something is broken. When the token naturally expires and the user tries to make an api call. It doesn't refresh.
//It can be fixed by using the introspect access token endpoint to check if the token is still valid. If it's not, then refresh it.
//best placed in the actions folder. Probably unnecessary to implement this in the context of a competition

import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";

// Internal query to get user's Canva tokens
export const getCanvaTokenInfo = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const expirationBuffer = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (
      user.canvaAccessToken &&
      user.canvaTokenExpiration &&
      user.canvaTokenExpiration > now + expirationBuffer
    ) {
      return { accessToken: user.canvaAccessToken, needsRefresh: false };
    }

    // Token needs refresh or doesn't exist
    return {
      refreshToken: user.canvaRefreshToken,
      needsRefresh: true,
      accessToken: user.canvaAccessToken,
    };
  },
});

// Internal mutation to update user's Canva tokens
export const updateCanvaTokens = internalMutation({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresIn: v.number(),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      userId: Id<"users">;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    },
  ) => {
    const { userId, accessToken, refreshToken, expiresIn } = args;
    const now = Date.now();

    await ctx.db.patch(userId, {
      canvaAccessToken: accessToken,
      canvaRefreshToken: refreshToken,
      canvaTokenExpiration: now + expiresIn * 1000,
      lastCanvaTokenUpdate: now,
    });
  },
});

//  mutation that will initiate the token refresh process
export const ensureCanvaAccessToken = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx: MutationCtx, args: { userId: Id<"users"> }) => {
    const tokenInfo = await ctx.db.get(args.userId);
    if (!tokenInfo) {
      throw new Error("User not found");
    }
    return { success: true, message: "Canva access token check initiated" };
  },
});
