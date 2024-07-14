import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getCurrentUserAndOrganization,
  requireRole,
} from "./accessControlHelpers";
import { ActivityTypes, logActivityHelper } from "./activities/activityHelpers";

export const listUserInvitations = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Fetch organization names for each invitation
    const invitationsWithOrgNames = await Promise.all(
      invitations.map(async (invitation) => {
        const organization = await ctx.db.get(invitation.organizationId);
        return {
          ...invitation,
          organizationName: organization?.name || "Unknown Organization",
        };
      }),
    );

    return invitationsWithOrgNames;
  },
});

export const createInvitation = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("editor"), v.literal("viewer"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const { user, organization } = await getCurrentUserAndOrganization(ctx);

    requireRole(user, ["admin", "editor"]);

    // Check if an invitation already exists for this email
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), organization._id),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .unique();

    if (existingInvitation) {
      throw new Error("An invitation for this email already exists");
    }

    const invitationId = await ctx.db.insert("invitations", {
      organizationId: organization._id,
      email: args.email,
      role: args.role,
      status: "pending",
      invitedBy: user._id,
      invitedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    });

    await logActivityHelper(
      ctx,
      user,
      organization,
      ActivityTypes.INVITE_SENT,
      {
        inviteeEmail: args.email,
      },
    );

    // TODO: Send an email to the invited user (implement this later)

    return invitationId;
  },
});

export const listPendingInvitations = query({
  handler: async (ctx) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    return await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organization._id),
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

export const revokeInvitation = mutation({
  args: { invitationId: v.id("invitations") },
  handler: async (ctx, args) => {
    const { user, organization } = await getCurrentUserAndOrganization(ctx);

    requireRole(user, ["admin"]);

    const invitation = await ctx.db.get(args.invitationId);

    if (!invitation || invitation.organizationId !== organization._id) {
      throw new Error("Invitation not found or not part of your organization");
    }

    await ctx.db.patch(args.invitationId, { status: "revoked" });

    return { success: true };
  },
});
