import { v } from "convex/values";

export const Conversation = v.object({
  userId: v.string(),
  title: v.string(),
  isPinned: v.optional(v.boolean()),
  isLive: v.optional(v.boolean()),
  streamStartedAt: v.optional(v.number()),
  currentStreamId: v.optional(v.string()),
  updatedAt: v.number(),
  createdAt: v.number(),
});
