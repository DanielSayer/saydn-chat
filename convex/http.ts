import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";

const http = httpRouter();
const cors = corsRouter(http, {
  allowedOrigins: ["http://localhost:3000"],
  allowedHeaders: ["Content-Type", "Authorization"],
  allowCredentials: true,
});

export default http;
