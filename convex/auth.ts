import { convexAuth } from "@convex-dev/auth/server";
import Password from "./auth/password_profile";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) return;

      await ctx.db.patch(args.userId, {
        role: "user",
      });
    },
  },
});
