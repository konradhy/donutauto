import { internalMutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import { DataModel, Doc, Id } from "../_generated/dataModel";

export const ActivityTypes = {
  CUSTOMER_CREATED: "CUSTOMER_CREATED",
  BULK_CUSTOMERS_CREATED: "BULK_CUSTOMERS_CREATED",
  CUSTOMER_DELETED: "CUSTOMER_DELETED",
  CAMPAIGN_CREATED: "CAMPAIGN_CREATED",
  BULK_CAMPAIGN_CREATED: "BULK_CAMPAIGN_CREATED",
  DESIGN_CREATED: "DESIGN_CREATED", //not yet in use
  INVITE_SENT: "INVITE_SENT",
  INVITE_ACCEPTED: "INVITE_ACCEPTED",
  CREATE_ORGANIZATION: "CREATE_ORGANIZATION",
} as const;

export type ActivityType = (typeof ActivityTypes)[keyof typeof ActivityTypes];

export function getActivityDetails(
  type: ActivityType,
  params: Record<string, string>,
): string {
  const userAction = `${params.userName} `;

  switch (type) {
    case ActivityTypes.CUSTOMER_CREATED:
      return `${userAction}added customer "${params.customerName}"`;
    case ActivityTypes.CAMPAIGN_CREATED:
      return `${userAction}created "${params.campaignName} campaign"`;
    case ActivityTypes.DESIGN_CREATED:
      return `${userAction}created ${params.designType} design for campaign "${params.campaignName}"`;
    case ActivityTypes.INVITE_SENT:
      return `${userAction}sent an invite to ${params.inviteeEmail} to join the team`;
    case ActivityTypes.BULK_CUSTOMERS_CREATED:
      return `${userAction}added ${params.customerCount} customers`;
    case ActivityTypes.CUSTOMER_DELETED:
      return `${userAction}deleted customer "${params.customerName}"`;
    case ActivityTypes.BULK_CAMPAIGN_CREATED:
      return `${userAction}started bulk campaign generation for ${params.totalCampaigns} customers`;
    case ActivityTypes.INVITE_ACCEPTED:
      return `${userAction}has joined us! Let's welcome them`;

    case ActivityTypes.CREATE_ORGANIZATION:
      return `Welcome! ${userAction} has created an account for "${params.organizationName}"`;
    default:
      return `${userAction}performed an unknown activity`;
  }
}

export function getActivityAction(type: ActivityType): string {
  switch (type) {
    case ActivityTypes.CUSTOMER_CREATED:
      return "Customer Created";
    case ActivityTypes.CAMPAIGN_CREATED:
      return "Campaign Created";
    case ActivityTypes.DESIGN_CREATED:
      return "Design Created";
    case ActivityTypes.INVITE_SENT:
      return "Invite Sent";
    case ActivityTypes.BULK_CUSTOMERS_CREATED:
      return "Bulk Customers Created";
    case ActivityTypes.CUSTOMER_DELETED:
      return "Customer Deleted";
    case ActivityTypes.BULK_CAMPAIGN_CREATED:
      return "Bulk Campaign Created";
    case ActivityTypes.CREATE_ORGANIZATION:
      return "Organization Created";
    case ActivityTypes.INVITE_ACCEPTED:
      return "Invite Accepted";
    default:
      return "Unknown Action";
  }
}

export async function logActivityHelper(
  ctx: MutationCtx,
  user: Doc<"users">,
  organization: Doc<"organizations">,
  activityType: ActivityType,
  params: Record<string, string>,
) {
  const activityDetails = getActivityDetails(activityType, {
    userName: user.name || user.email || "Unknown User",
    ...params,
  });
  const activityAction = getActivityAction(activityType);

  await ctx.db.insert("activities", {
    userId: user._id,
    organizationId: organization._id,
    action: activityAction,
    details: activityDetails,
    itemId: params.itemId,
  });
}

export async function logInternalActivity(
  ctx: MutationCtx,
  userId: Id<"users">,
  organizationId: Id<"organizations">,
  activityType: ActivityType,
  params: Record<string, string>,
) {
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const userName = user.name || user.email || "Unknown User";

  const activityDetails = getActivityDetails(activityType, {
    userName,
    ...params,
  });
  const activityAction = getActivityAction(activityType);

  await ctx.db.insert("activities", {
    userId,
    organizationId,
    action: activityAction,
    details: activityDetails,
    itemId: params.itemId,
  });
}
