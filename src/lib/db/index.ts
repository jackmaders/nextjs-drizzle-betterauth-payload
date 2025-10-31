import { drizzle } from "drizzle-orm/libsql";

// biome-ignore lint/style/noNonNullAssertion: DB_FILE_NAME must always be set
export const db = drizzle(process.env.DB_FILE_NAME!);
