import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nextCookies } from "better-auth/next-js";
import { buildConfig } from "payload";
import {
  type BetterAuthPluginOptions,
  betterAuthPlugin,
} from "payload-auth/better-auth";
import sharp from "sharp";

const betterAuthOptions: BetterAuthPluginOptions["betterAuthOptions"] = {
  emailAndPassword: {
    enabled: true,
  },

  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
};

const betterAuthPlugins = [
  nextCookies(),
  // admin(), // Add other Better Auth plugins here
];

// 2. EXPORT THE TYPE of this array for other files to use
export type BetterAuthPluginsType = typeof betterAuthPlugins;

export default buildConfig({
  editor: lexicalEditor(),
  collections: [],
  secret: process.env.PAYLOAD_SECRET || "",
  db: sqliteAdapter({
    client: {
      // biome-ignore lint/style/noNonNullAssertion: DB_FILE_NAME must always be set
      url: process.env.DB_FILE_NAME!,
    },
  }),
  sharp,
  plugins: [
    betterAuthPlugin({
      requireAdminInviteForSignUp: false,
      betterAuthOptions,
      users: {
        slug: "users",
      },
    }),
  ],
});
