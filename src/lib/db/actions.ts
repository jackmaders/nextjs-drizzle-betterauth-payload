"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "./schema";

export async function drizzleTest() {
  const newUser: typeof user.$inferInsert = {
    name: "John",
    email: "john@example.com",
    id: crypto.randomUUID(),
  };

  await db.insert(user).values(newUser);
  console.log("New user created!");

  const users = await db.select().from(user);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(user)
    .set({
      name: "Richard",
    })
    .where(eq(user.email, newUser.email));
  console.log("User info updated!");

  await db.delete(user).where(eq(user.email, newUser.email));
  console.log("User deleted!");
}
