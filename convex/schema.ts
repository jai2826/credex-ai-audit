import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    fullName: v.string(),
    workEmail: v.string(),
    companyName: v.optional(v.string()),
    role: v.optional(v.string()),
    teamSize: v.optional(v.string()),
    auditDataSummary: v.optional(v.string()), 
    createdAt: v.number(),
  }).index("by_email", ["workEmail"]),
});