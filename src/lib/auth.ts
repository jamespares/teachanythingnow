import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";

export function getAuth(db: ReturnType<typeof getDb>, env: { BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string }) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
  });
}
