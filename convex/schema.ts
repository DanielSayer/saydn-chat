import { defineSchema, defineTable } from "convex/server";
import { Conversation } from "./schema/conversations";
import { authTables } from "@convex-dev/auth/server";
import { Message } from "./schema/messages";

export default defineSchema({
  ...authTables,
  conversations: defineTable(Conversation)
    .index("by_user", ["userId"])
    .index("by_updated_at", ["updatedAt"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),

  messages: defineTable(Message)
    .index("by_conversation", ["conversationId"])
    .index("by_message", ["messageId"]),
});
