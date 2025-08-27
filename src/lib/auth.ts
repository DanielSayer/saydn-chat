import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { env } from "@/env/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins/jwt";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"].filter(Boolean),
  baseURL: env.VITE_BETTER_AUTH_URL || "http://localhost:3000",

  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt({
      jwt: {
        audience: "saydn-chat",
        expirationTime: "6h",
      },
      jwks: {
        remoteUrl: `${env.VITE_BETTER_AUTH_URL}/api/auth/jwks`,
        keyPairConfig: {
          alg: "RS256",
          modulusLength: 2048,
          // @ts-expect-error required for convex
          extractable: true,
        },
      },
    }),
  ],
});
