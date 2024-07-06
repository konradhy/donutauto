import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/*
To do:
1. Delete user 
2. Update roles: admin, editor, scheduler user?

 



*/

/**
 * Creates a new user in the database.
 * This should be called when a new user signs up through Clerk.
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // Check if a user with this email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User with this email already exists");
    }

    // Create the new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      tokenIdentifier: args.tokenIdentifier,
      isCanvaConnected: false,
      role: "user", // Default role
    });

    return userId;
  },
});

/**
 * Retrieves a user by their email address.
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});
