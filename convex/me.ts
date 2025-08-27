import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const me = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
