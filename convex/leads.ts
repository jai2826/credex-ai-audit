import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLead = mutation({
  args: {
    fullName: v.string(),
    workEmail: v.string(),
    companyName: v.string(),
    role:v.string(),
    teamSize:v.string(),
    auditDataSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("workEmail", args.workEmail))
      .first();

    if (existing) {
      return existing._id;
    }

    const leadId = await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
    });
    return leadId;
  },
});