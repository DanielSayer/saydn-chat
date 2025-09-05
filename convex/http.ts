import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { createChat } from "./http_actions/create_chat/route";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

const cors = corsRouter(http, {
  allowedOrigins: ["http://localhost:3000", "https://saydn-chat.vercel.app"],
  allowedHeaders: ["Content-Type", "Authorization"],
  allowCredentials: true,
});

cors.route({
  method: "POST",
  path: "/api/chat",
  handler: createChat,
});

export default http;
