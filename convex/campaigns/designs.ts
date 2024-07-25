import { Doc } from "../_generated/dataModel";
import { internalMutation, internalQuery, query } from "../_generated/server";
import { getCurrentUserAndOrganization } from "../accessControlHelpers";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const updateDesignAfterAutofill = internalMutation({
  args: {
    designId: v.id("designs"),
    canvaDesignId: v.string(),
    viewUrl: v.string(),
    editUrl: v.string(),
    thumbnailUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { designId, canvaDesignId, viewUrl, editUrl, thumbnailUrl } = args;
    await ctx.db.patch(designId, {
      canvaDesignId,
      viewUrl,
      editUrl,
      thumbnailUrl,
      status: "completed",
    });
  },
});

export const updateDesignStatus = internalMutation({
  args: {
    designId: v.id("designs"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { designId, status, errorMessage } = args;
    await ctx.db.patch(designId, {
      status,
      errorMessage,
    });
  },
});

export const getPendingAutofillJobs = internalQuery({
  handler: async (ctx) => {
    console.log("Getting pending autofill jobs");
    const jobs = await ctx.db
      .query("designs")
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .collect();
    console.log(jobs);

    return jobs;
  },
});

export const getAllDesigns = query({
  handler: async (ctx) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);
    if (!organization) {
      throw new Error("Organization not found");
    }
    const designs = await ctx.db
      .query("designs")
      .filter((q) => q.eq(q.field("organizationId"), organization._id))
      .order("desc")
      .collect();
    return designs;
  },
});

export const getAllDesignsWithCampaigns = query({
  handler: async (
    ctx,
  ): Promise<
    { design: Doc<"designs">; campaign: Doc<"campaigns"> | null }[]
  > => {
    const { organization } = await getCurrentUserAndOrganization(ctx);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const designs = await ctx.db
      .query("designs")
      .order("desc")
      .filter((q) => q.eq(q.field("organizationId"), organization._id))
      .collect();

    const designsWithCampaigns = await Promise.all(
      designs.map(async (design) => {
        const campaign = await ctx.db.get(design.campaignId);
        return { design, campaign };
      }),
    );

    return designsWithCampaigns;
  },
});

export const getPaginatedDesignsWithCampaigns = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);
    if (!organization) {
      throw new Error("Organization not found");
    }

    let designsQuery;

    if (args.searchTerm) {
      designsQuery = ctx.db
        .query("designs")
        .withSearchIndex("search_designs", (q) =>
          q
            .search("title", args.searchTerm || "")
            .eq("organizationId", organization._id),
        );
    } else {
      designsQuery = ctx.db
        .query("designs")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", organization._id),
        );
    }

    const paginatedDesigns = await designsQuery.paginate(args.paginationOpts);

    const designsWithCampaigns = await Promise.all(
      paginatedDesigns.page.map(async (design) => {
        const campaign = await ctx.db.get(design.campaignId);
        return { design, campaign };
      }),
    );

    return {
      ...paginatedDesigns,
      page: designsWithCampaigns,
    };
  },
});

export const getDesignById = query({
  args: {
    designId: v.id("designs"),
  },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const design = await ctx.db.get(args.designId);
    if (organization._id === design?.organizationId) {
      return design;
    }

    throw new ConvexError(
      "Either design does not exist or it does not belong to the organization",
    );
  },
});

export const getDesignsByCampaignId = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const { organization } = await getCurrentUserAndOrganization(ctx);

    const designs = await ctx.db
      .query("designs")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .filter((q) => q.eq(q.field("organizationId"), organization._id))
      .collect();

    return designs;
  },
});
