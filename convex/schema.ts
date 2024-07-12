import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    canvaAccessToken: v.optional(v.string()),
    canvaRefreshToken: v.optional(v.string()),
    canvaTokenExpiration: v.optional(v.number()), // Unix timestamp
    canvaUserId: v.optional(v.string()), // Canva's user ID if available
    lastLogin: v.optional(v.number()), // Unix timestamp
    isCanvaConnected: v.boolean(),
    role: v.optional(v.string()), // Admin, User, Viewer.
    tokenIdentifier: v.string(),
    lastCanvaTokenUpdate: v.optional(v.number()),
    organizationId: v.optional(v.id("organizations")),
  })
    .index("by_email", ["email"])
    .index("by_token_identifier", ["tokenIdentifier"])
    .index("by_organization", ["organizationId"]),

  organizations: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    invitationCode: v.optional(v.string()),
  }),

  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    status: v.string(), // "pending", "accepted", "declined", "revoked"
    invitedBy: v.id("users"),
    invitedAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_organization", ["organizationId"]),

  customers: defineTable({
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    generatedDesignUrl: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    tiktokHandle: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    campaigns: v.optional(v.array(v.id("campaigns"))),
    designs: v.optional(v.array(v.id("designs"))),
    userId: v.id("users"),
  })
    .index("by_email", ["email"])
    .index("by_organization", ["organizationId"])
    .index("by_userId", ["userId"]),

  campaigns: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    customerId: v.id("customers"),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.string(), // "in_progress", "completed", "failed"
    platforms: v.array(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customerId", ["customerId"]),

  designs: defineTable({
    organizationId: v.id("organizations"),
    campaignId: v.id("campaigns"),
    userId: v.id("users"),
    customerId: v.id("customers"),
    platform: v.string(),
    designId: v.optional(v.string()),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    status: v.string(), // "created", "failed"
    jobId: v.string(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_campaignId", ["campaignId"])
    .index("by_userId", ["userId"]),

  brandTemplateSettings: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    emailTemplateId: v.optional(v.string()),
    instagramTemplateId: v.optional(v.string()),
    twitterTemplateId: v.optional(v.string()),
    tiktokTemplateId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_organization", ["organizationId"]),
});
