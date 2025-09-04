import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Conversation } from "./schema/conversations";
import { Message } from "./schema/messages";
import { Usage } from "./schema/usage";
import { Users } from "./schema/users";

export default defineSchema({
  ...authTables,
  users: defineTable(Users).index("email", ["email"]),
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
  usage: defineTable(Usage).index("by_user_day", ["userId", "daysSinceEpoch"]),
});
