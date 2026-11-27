"use server";

import { redirect } from "next/navigation";
import { login, logout } from "./session";

export async function signIn(_state: string, form: FormData) {
  const input = form.get("password");
  if (typeof input !== "string" || input.length > 1024 || !(await login(input))) {
    return "Could not sign in. Check your password.";
  }
  redirect("/admin");
}

export async function signOut() {
  await logout();
  redirect("/admin");
}
