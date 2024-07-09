import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";

export const generateCampaign = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Fetch the user data to get the Canva access token
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user || !user.canvaAccessToken) {
      throw new Error("User not found or Canva not connected");
    }

    // Fetch the customer data
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    const { _id, _creationTime, createdAt, phone, updatedAt, ...customerData } =
      customer;

    console.log(
      `Starting campaign generation for customer: ${customer.firstName} ${customer.lastName}`,
    );

    // Schedule the campaign generation action
    await ctx.scheduler.runAfter(
      0,
      internal.campaignActions.generateCampaignAction,
      {
        customerId: args.customerId,
        customerData,
        canvaAccessToken: user.canvaAccessToken,
      },
    );

    return { message: "Campaign generation started" };
  },
});
