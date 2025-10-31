import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { account, session, user, verification } from "../db/schema";

const { api, $Infer } = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, account, session, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

type Session = typeof $Infer.Session;

export { api, type Session };
