import { getUser } from "@/convex/lib/auth/get_user";
import { httpAction } from "../../_generated/server";
import { ChatError } from "@/lib/errors/chat-error";

export const create = httpAction(async (ctx, req) => {
  const body = await req.json();

  const user = await getUser(ctx.auth);
  if (!user) {
    throw new ChatError("unauthorized:chat").toResponse();
  }

  return new Response();
});
