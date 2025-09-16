import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contactMessages", {
      ...args,
      createdAt: Date.now(),
      status: "new",
    });
    return id;
  },
});
