import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createConversation = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("conversations", {
      userId: args.userId,
      title: "New chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateConversationTitle = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.conversationId, { title: args.title });
  },
});

export const markAsUpdated = internalMutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });
  },
});

export const getUserConversations = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }
    const conversationsQuery = ctx.db
      .query("conversations")
      .withIndex("by_updated_at")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.neq(q.field("isPinned"), true))
      .order("desc")
      .paginate(args.paginationOpts);

    const isFirstPage = !args.paginationOpts.cursor;
    if (isFirstPage) {
      const pinnedQuery = ctx.db
        .query("conversations")
        .withIndex("by_updated_at")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isPinned"), true))
        .order("desc")
        .collect();

      const [pinnedResult, conversationsResult] = await Promise.all([
        pinnedQuery,
        conversationsQuery,
      ]);

      const combinedPage = [...pinnedResult, ...conversationsResult.page];

      if (combinedPage.length > args.paginationOpts.numItems) {
        return {
          page: combinedPage.slice(0, args.paginationOpts.numItems),
          isDone: false,
          continueCursor: conversationsResult.continueCursor,
        };
      }

      return {
        page: combinedPage,
        isDone: conversationsResult.isDone,
        continueCursor: conversationsResult.continueCursor,
      };
    }

    return await conversationsQuery;
  },
});

export const searchUserConversations = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!args.query.trim()) {
      return await ctx.db
        .query("conversations")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("conversations")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query.trim()).eq("userId", userId),
      )
      .paginate(args.paginationOpts);
  },
});
