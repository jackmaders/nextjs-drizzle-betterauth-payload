import {
  type CloudflareContext,
  getCloudflareContext,
} from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite"; 
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nextCookies } from "better-auth/next-js";
import { buildConfig } from "payload";
import {
  type BetterAuthPluginOptions,
  betterAuthPlugin,
} from "payload-auth/better-auth";
import sharp from "sharp";
import type { GetPlatformProxyOptions } from "wrangler";
import { Players } from "@/collections/Players";
import { Teams } from "@/collections/Teams";

const cloudflareRemoteBindings = process.env.NODE_ENV === "production";
const cloudflare =
  process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
  !cloudflareRemoteBindings
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true });

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
  db: sqliteD1Adapter({ binding: cloudflare.env.owtvgg_examples }),
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

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(
    /* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`
  ).then(({ getPlatformProxy }) =>
    getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: cloudflareRemoteBindings
    } satisfies GetPlatformProxyOptions),
  );
}
