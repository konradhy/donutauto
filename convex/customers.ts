import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getCurrentUserAndOrganization } from "./accessControlHelpers";
import { ActivityTypes, logActivityHelper } from "./activities/activityHelpers";

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
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    const customerId = await ctx.db.insert("customers", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user._id,
      organizationId: organization._id,
    });

    await logActivityHelper(
      ctx,
      user,
      organization,
      ActivityTypes.CUSTOMER_CREATED,
      {
        customerName: `${args.firstName} ${args.lastName}`,
        itemId: customerId,
      },
    );

    return customerId;
  },
});

export const bulkAddCustomers = mutation({
  args: {
    customers: v.array(
      v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        dob: v.optional(v.string()),
        preferences: v.optional(v.array(v.string())),
        instagramHandle: v.optional(v.string()),
        tiktokHandle: v.optional(v.string()),
        twitterHandle: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    const results = await Promise.all(
      args.customers.map(async (customer) => {
        if (!customer.firstName || !customer.lastName || !customer.email) {
          return { skipped: true, reason: "Missing required fields" };
        }
        try {
          const customerId = await ctx.db.insert("customers", {
            ...customer,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            userId: user._id,
            organizationId: organization._id,
          });
          return { added: true, id: customerId };
        } catch (error) {
          return { error: true, message: (error as Error).message };
        }
      }),
    );

    const added = results.filter((result) => "added" in result && result.added);
    const skipped = results.filter((result) => "skipped" in result);
    const errors = results.filter((result) => "error" in result);

    await logActivityHelper(
      ctx,
      user,
      organization,
      ActivityTypes.BULK_CUSTOMERS_CREATED,
      { customerCount: added.length.toString() },
    );

    return {
      addedCount: added.length,
      skippedCount: skipped.length,
      errorCount: errors.length,
      addedIds: added.map((result) => ("id" in result ? result.id : null)),
    };
  },
});

export const getCustomer = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const customer = await ctx.db.get(args.id);
    if (!customer || customer.organizationId !== organization._id) {
      throw new Error("Customer not found in your organization");
    }

    return customer;
  },
});

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
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const { id, ...updateFields } = args;
    const existingCustomer = await ctx.db.get(id);
    if (
      !existingCustomer ||
      existingCustomer.organizationId !== organization._id
    ) {
      throw new Error("Customer not found in your organization");
    }

    const updatedCustomer = await ctx.db.patch(id, {
      ...updateFields,
      updatedAt: Date.now(),
    });

    return updatedCustomer;
  },
});

export const deleteCustomer = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const { organization, user } = await getCurrentUserAndOrganization(ctx);

    const existingCustomer = await ctx.db.get(args.id);
    if (
      !existingCustomer ||
      existingCustomer.organizationId !== organization._id
    ) {
      throw new Error("Customer not found in your organization");
    }
    await logActivityHelper(
      ctx,
      user,
      organization,
      ActivityTypes.CUSTOMER_DELETED,
      {
        customerName: `${existingCustomer.firstName} ${existingCustomer.lastName}`,
        itemId: existingCustomer._id,
      },
    );

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const listCustomers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const customersQuery = ctx.db
      .query("customers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .order("desc");

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

export const updateCustomerField = mutation({
  args: {
    id: v.id("customers"),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const { id, field, value } = args;
    const existingCustomer = await ctx.db.get(id);
    if (
      !existingCustomer ||
      existingCustomer.organizationId !== organization._id
    ) {
      throw new Error("Customer not found in your organization");
    }

    const updatedCustomer = await ctx.db.patch(id, {
      [field]: value,
      updatedAt: Date.now(),
    });
    return updatedCustomer;
  },
});
