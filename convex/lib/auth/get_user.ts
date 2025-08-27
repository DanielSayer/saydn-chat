import type { Auth } from "convex/server";

export const getUser = async (auth: Auth) => {
  const user = await auth.getUserIdentity();

  if (!user) {
    return;
  }

  return {
    ...user,
    id: user.subject,
  };
};
