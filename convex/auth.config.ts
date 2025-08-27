import { env } from "@/env/server";

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: "saydn-chat",
      issuer: env.BETTER_AUTH_URL,
      jwks: `http://127.0.0.1:3210/api/auth/jwks`,
      algorithm: "RS256",
    },
  ],
};
