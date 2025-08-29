import type { Conversation } from "./types";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";

function groupConversationsByTimeBracket(conversations: Conversation[]) {
  const now = new Date();
  const lastWeek = subWeeks(now, 1);
  const lastMonth = subMonths(now, 1);

  return conversations.reduce(
    (acc, conversation) => {
      const updatedAt = new Date(conversation.updatedAt);
      const isThisWeek = lastWeek.getTime() <= updatedAt.getTime();
      const isThisMonth = lastMonth.getTime() <= updatedAt.getTime();
      if (conversation.isPinned) {
        acc.isPinned.push(conversation);
      } else if (isToday(updatedAt)) {
        acc.today.push(conversation);
      } else if (isYesterday(updatedAt)) {
        acc.yesterday.push(conversation);
      } else if (isThisWeek) {
        acc.thisWeek.push(conversation);
      } else if (isThisMonth) {
        acc.thisMonth.push(conversation);
      } else {
        acc.older.push(conversation);
      }

      return acc;
    },
    {
      isPinned: [] as Conversation[],
      today: [] as Conversation[],
      yesterday: [] as Conversation[],
      thisWeek: [] as Conversation[],
      thisMonth: [] as Conversation[],
      older: [] as Conversation[],
    },
  );
}

export { groupConversationsByTimeBracket };
