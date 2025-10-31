"use client";

import type { ComponentProps } from "react";
import { drizzleTest } from "@/lib/db/actions";
import { Button } from "./ui/button";

export function DrizzleTest(props: ComponentProps<typeof Button>) {
  async function handleOnClick() {
    await drizzleTest();

    alert("drizzle test complete. please check server logs");
  }

  return <Button type="button" onClick={handleOnClick} {...props} />;
}
