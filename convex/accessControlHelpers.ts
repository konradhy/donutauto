import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token_identifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getCurrentUserAndOrganization(
  ctx: QueryCtx | MutationCtx,
) {
  const user = await getCurrentUser(ctx);

  if (!user.organizationId) {
    throw new Error("User is not associated with an organization");
  }

  const organization = await ctx.db.get(user.organizationId);
  if (!organization) {
    throw new Error("Organization not found");
  }

  return { user, organization };
}

export async function requireOwnership(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">,
) {
  const { user, organization } = await getCurrentUserAndOrganization(ctx);

  if (organization._id !== organizationId) {
    throw new Error("User does not have access to this organization");
  }

  return { user, organization };
}

export function requireRole(user: any, allowedRoles: string[]) {
  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new Error("User does not have the required role");
  }
}
