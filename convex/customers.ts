import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const add = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    dob: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    instagramHandle: v.optional(v.string()),
    tiktokHandle: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    // Get the user's information
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Optional: Check user role
    // if (user.role !== "admin" && user.role !== "manager") {
    //   throw new Error("Unauthorized: Only an admin can add a user");
    // }

    // Insert the new customer
    const customerId = await ctx.db.insert("customers", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return customerId;
  },
});

// Get a single customer by ID
export const getCustomer = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const customer = await ctx.db.get(args.id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  },
});

// Update an existing customer
export const updateCustomer = mutation({
  args: {
    id: v.id("customers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dob: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    instagramHandle: v.optional(v.string()),
    tiktokHandle: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...updateFields } = args;
    const existingCustomer = await ctx.db.get(id);
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    const updatedCustomer = await ctx.db.patch(id, {
      ...updateFields,
      updatedAt: Date.now(),
    });

    return updatedCustomer;
  },
});

// Delete a customer
export const deleteCustomer = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const existingCustomer = await ctx.db.get(args.id);
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// List customers with pagination
export const listCustomers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const customersQuery = ctx.db.query("customers").order("desc");

    const paginatedResult = await customersQuery.paginate(args.paginationOpts);

    return {
      ...paginatedResult,
      page: paginatedResult.page.map((customer) => ({
        ...customer,
        fullName: `${customer.firstName} ${customer.lastName}`,
      })),
    };
  },
});

// Update a single field of a customer
export const updateCustomerField = mutation({
  args: {
    id: v.id("customers"),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const { id, field, value } = args;
    const updatedCustomer = await ctx.db.patch(id, { [field]: value });
    return updatedCustomer;
  },
});
