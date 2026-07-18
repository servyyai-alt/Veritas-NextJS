import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "fallback_secret";
const EXPIRES = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "veritas_admin_token";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function authResponse(message = "Unauthorized", status = 401) {
  return Response.json({ success: false, message }, { status });
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
