import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { account, session, user, verification } from "./src/lib/db/schema";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [],

  secret: process.env.PAYLOAD_SECRET || "",
  db: sqliteAdapter({
    client: {
      // biome-ignore lint/style/noNonNullAssertion: DB_FILE_NAME must always be set
      url: process.env.DB_FILE_NAME!,
    },

    beforeSchemaInit: [
      ({ schema }) => {
        return {
          ...schema,
          tables: {
            ...schema.tables,
            user,
            account,
            session,
            verification,
          },
        };
      },
    ],
  }),
  sharp,
});
