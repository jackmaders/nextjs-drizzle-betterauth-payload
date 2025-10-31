"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps, useActionState, useEffect } from "react";
import type { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { SubmitButton } from "../shared/submit-button";

export function LogOutButton(props: ComponentProps<typeof Button>) {
  const router = useRouter();
  const [state, formAction] = useActionState(logout, {});

  useEffect(() => {
    if (state.success) router.push("/");
  }, [state.success, router]);

  return (
    <form action={formAction}>
      <SubmitButton {...props}>Log Out</SubmitButton>
    </form>
  );
}
