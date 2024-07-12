// File: convex/organizations.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./accessControlHelpers";

// Create a new organization
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Check if the user already has an organization
    if (user.organizationId) {
      throw new Error("User already belongs to an organization");
    }

    // Create the new organization
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      ownerId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update the user with the new organization ID
    await ctx.db.patch(user._id, { organizationId });

    return organizationId;
  },
});

// Check if the current user has an organization
export const checkUserOrganization = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    return {
      hasOrganization: !!user.organizationId,
      organizationId: user.organizationId,
    };
  },
});

// Get organization details
export const getOrganizationDetails = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user.organizationId) {
      return null;
    }

    const organization = await ctx.db.get(user.organizationId);
    return organization;
  },
});

// // Join an existing organization with inviteCode
// export const joinOrganization = mutation({
//   args: { invitationCode: v.string() },
//   handler: async (ctx, args) => {
//     const user = await getCurrentUser(ctx);

//     if (user.organizationId) {
//       throw new Error("User already belongs to an organization");
//     }

//     // Logic to validate the invitation code?
//     //something like this

//     const organization = await ctx.db
//       .query("organizations")
//       .filter(q => q.eq(q.field("invitationCode"), args.invitationCode))
//       .unique();

//     if (!organization) {
//       throw new Error("Invalid invitation code");
//     }

//     await ctx.db.patch(user._id, { organizationId: organization._id });

//     return organization._id;
//   },
// });

// List users in an organization (for admin purposes)
export const listOrganizationUsers = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user.organizationId) {
      throw new Error("User does not belong to an organization");
    }

    // Fetch all users in the organization
    const organizationUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), user.organizationId))
      .collect();

    // Return user details without sensitive information
    return organizationUsers.map(({ _id, name, email, role }) => ({
      _id,
      name,
      email,
      role,
    }));
  },
});

export const acceptInvitation = mutation({
  args: { invitationId: v.id("invitations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invitation = await ctx.db.get(args.invitationId);

    if (!invitation || invitation.status !== "pending") {
      throw new Error("Invalid or expired invitation");
    }

    if (user.organizationId) {
      throw new Error("User already belongs to an organization");
    }

    // Update user's organization
    await ctx.db.patch(user._id, {
      organizationId: invitation.organizationId,
      role: invitation.role,
    });

    // Update invitation status
    await ctx.db.patch(args.invitationId, { status: "accepted" });

    return invitation.organizationId;
  },
});
