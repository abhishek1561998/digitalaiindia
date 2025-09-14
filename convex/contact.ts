import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new contact message
export const createContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const contactId = await ctx.db.insert("contact", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      company: args.company,
      subject: args.subject,
      message: args.message,
      service: args.service,
      status: "new",
      createdAt: now,
      updatedAt: now,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    return contactId;
  },
});

// Get all contact messages (for admin use)
export const getAllContactMessages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const messages = await ctx.db
      .query("contact")
      .order("desc")
      .take(limit);

    return messages;
  },
});

// Get contact messages by status
export const getContactMessagesByStatus = query({
  args: {
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("closed")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const messages = await ctx.db
      .query("contact")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(limit);

    return messages;
  },
});

// Update contact message status
export const updateContactMessageStatus = mutation({
  args: {
    id: v.id("contact"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("closed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Get contact message by ID
export const getContactMessage = query({
  args: {
    id: v.id("contact"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    return message;
  },
});

// Get contact statistics
export const getContactStats = query({
  handler: async (ctx) => {
    const allMessages = await ctx.db.query("contact").collect();
    
    const stats = {
      total: allMessages.length,
      new: allMessages.filter(m => m.status === "new").length,
      read: allMessages.filter(m => m.status === "read").length,
      replied: allMessages.filter(m => m.status === "replied").length,
      closed: allMessages.filter(m => m.status === "closed").length,
      today: allMessages.filter(m => {
        const today = new Date();
        const messageDate = new Date(m.createdAt);
        return messageDate.toDateString() === today.toDateString();
      }).length,
      thisWeek: allMessages.filter(m => {
        const now = Date.now();
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        return m.createdAt >= weekAgo;
      }).length,
    };

    return stats;
  },
});
