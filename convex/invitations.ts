import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
