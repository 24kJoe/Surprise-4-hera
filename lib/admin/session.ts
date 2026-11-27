import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const name = "surprise-admin";
const lifetime = 8 * 60 * 60;
const signingSecret = () => process.env.ADMIN_PASSWORD ?? "";
const password = () => process.env.NODE_ENV === "development"
  ? process.env.ADMIN_DEV_PASSWORD ?? signingSecret()
  : signingSecret();
export const adminConfigured = () => signingSecret().length >= 24 && password().length > 0;
const digest = (value: string) => createHash("sha256").update(value).digest();
const sign = (expiry: string) => createHmac("sha256", signingSecret()).update("admin:" + expiry).digest("hex");

export async function login(input: string) {
  if (!adminConfigured() || !timingSafeEqual(digest(input), digest(password()))) return false;
  const expiry = String(Date.now() + lifetime * 1000);
  (await cookies()).set(name, expiry + "." + sign(expiry), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: lifetime,
  });
  return true;
}

export async function isAdmin() {
  const token = (await cookies()).get(name)?.value.match(/^(\d+)\.([a-f0-9]{64})$/);
  return Boolean(adminConfigured() && token && Number(token[1]) > Date.now() &&
    timingSafeEqual(Buffer.from(token[2], "hex"), Buffer.from(sign(token[1]), "hex")));
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Admin sign-in required");
}

export async function logout() {
  (await cookies()).delete(name);
}
