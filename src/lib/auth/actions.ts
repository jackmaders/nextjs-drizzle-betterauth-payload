"use server";

import { constants } from "node:http2";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { api } from "./index";
import type { ActionResult } from "./types";

export async function login(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }
  if (!password || typeof password !== "string") {
    return { error: "Password is required" };
  }

  const response = await api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
    asResponse: true,
  });

  revalidatePath("/");
  if (response.ok) return { success: true };

  switch (response.status) {
    case constants.HTTP_STATUS_UNAUTHORIZED:
      return { error: "Invalid email or password. Please try again." };
  }

  console.error(await response.json());
  return { error: "An unexpected error occurred. Please try again." };
}

export async function signup(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  if (!name || typeof name !== "string") {
    return { error: "Name is required" };
  }
  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }
  if (!password || typeof password !== "string") {
    return { error: "Password is required" };
  }
  if (!confirmPassword || typeof confirmPassword !== "string") {
    return { error: "Please confirm your password" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  const response = await api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers: await headers(),
    asResponse: true,
  });

  revalidatePath("/");

  if (response.ok) return { success: true };

  switch (response.status) {
    case constants.HTTP_STATUS_UNPROCESSABLE_ENTITY:
      return { error: "A user with this email already exists." };
  }

  console.error(await response.json());
  return { error: "An unexpected error occurred. Please try again." };
}

export async function logout(
  _prevState: ActionResult,
  _formData: FormData,
): Promise<ActionResult> {
  const response = await api.signOut({
    headers: await headers(),
    asResponse: true,
  });

  revalidatePath("/");

  if (response.ok) return { success: true };

  console.error(await response.json());
  return { error: "An unexpected error occurred. Please try again." };
}
