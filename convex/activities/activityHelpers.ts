import { internalMutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import { DataModel, Doc } from "../_generated/dataModel";

export const ActivityTypes = {
  CUSTOMER_CREATED: "CUSTOMER_CREATED",
  BULK_CUSTOMERS_CREATED: "BULK_CUSTOMERS_CREATED",
  CAMPAIGN_CREATED: "CAMPAIGN_CREATED",
  DESIGN_CREATED: "DESIGN_CREATED",
  INVITE_SENT: "INVITE_SENT",
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
      return `${userAction}created campaign "${params.campaignName}"`;
    case ActivityTypes.DESIGN_CREATED:
      return `${userAction}created ${params.designType} design for campaign "${params.campaignName}"`;
    case ActivityTypes.INVITE_SENT:
      return `${userAction}sent invite to ${params.inviteeEmail}`;
    case ActivityTypes.BULK_CUSTOMERS_CREATED:
      return `${userAction}added ${params.customerCount} customers`;

    default:
      return `${userAction}performed an unknown activity`;
  }
}

//this might be cool to show in the ui realtime to everyone as a badge falling from the top of the screen
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
  });
}
