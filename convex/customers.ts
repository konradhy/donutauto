import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    dob: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    //check role of user
    //make sure you're logged in
    const customerId = await ctx.db.insert("customers", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return customerId;
  },
});
