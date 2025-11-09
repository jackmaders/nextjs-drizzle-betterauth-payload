import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nextCookies } from "better-auth/next-js";
import { buildConfig } from "payload";
import {
  type BetterAuthPluginOptions,
  betterAuthPlugin,
} from "payload-auth/better-auth";
import sharp from "sharp";
import { Players } from "@/collections/Players";
import { Teams } from "@/collections/Teams";

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

const betterAuthPlugins = [nextCookies()];

// 2. EXPORT THE TYPE of this array for other files to use
export type BetterAuthPluginsType = typeof betterAuthPlugins;

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Players, Teams],
  secret: process.env.PAYLOAD_SECRET || "",
  db: sqliteAdapter({
    client: {
      // biome-ignore lint/style/noNonNullAssertion: DB_FILE_NAME must always be set
      url: process.env.DB_FILE_NAME!,
    },
  }),
  serverURL: "http://localhost:3000",
  sharp,
  plugins: [
    betterAuthPlugin({
      betterAuthOptions,
      disableDefaultPayloadAuth: true,
      users: {
        slug: "users",
        // --- ADD THIS ---
        collectionOverrides: ({ collection }) => ({
          ...collection,
          timestamps: true, // Tell Payload to manage createdAt/updatedAt
        }),
        // --- END ADD ---
      },
      // --- ADD THIS FOR ACCOUNTS ---
      accounts: {
        collectionOverrides: ({ collection }) => ({
          ...collection,
          timestamps: true,
        }),
      },
      // --- ADD THIS FOR SESSIONS ---
      sessions: {
        collectionOverrides: ({ collection }) => ({
          ...collection,
          timestamps: true,
        }),
      },
      // --- ADD THIS FOR VERIFICATIONS ---
      verifications: {
        collectionOverrides: ({ collection }) => ({
          ...collection,
          timestamps: true,
        }),
      },
    }),
  ],
  typescript: {
    outputFile: "src/lib/db/types.ts",
  },
});
