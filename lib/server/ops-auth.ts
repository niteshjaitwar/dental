import { cookies } from "next/headers";

const OPS_COOKIE_NAME = "dental_ops_session";
const encoder = new TextEncoder();

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function safeEqual(a: string, b: string) {
  const [left, right] = await Promise.all([sha256(a), sha256(b)]);

  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export async function getOpsSessionValue(token: string) {
  return sha256(token);
}

export async function isOpsTokenValid(candidate: string, expected: string | undefined) {
  if (!expected || !candidate) {
    return false;
  }

  return safeEqual(candidate, expected);
}

export async function setOpsSessionCookie(token: string) {
  const store = await cookies();
  store.set(OPS_COOKIE_NAME, await getOpsSessionValue(token), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearOpsSessionCookie() {
  const store = await cookies();
  store.set(OPS_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function hasValidOpsSession() {
  const expectedToken = process.env.OPS_DASHBOARD_TOKEN;

  if (!expectedToken) {
    return false;
  }

  const store = await cookies();
  const cookieValue = store.get(OPS_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return false;
  }

  return safeEqual(cookieValue, await getOpsSessionValue(expectedToken));
}

export { OPS_COOKIE_NAME };