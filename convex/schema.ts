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
    role: v.optional(v.string()), // Admin, User, etc.
    tokenIdentifier: v.string(),
    lastCanvaTokenUpdate: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_token_identifier", ["tokenIdentifier"]),

  customers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    dob: v.optional(v.string()),
    generatedDesignUrl: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    tiktokHandle: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),
});
