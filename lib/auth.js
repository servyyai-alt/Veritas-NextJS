import { signToken, verifyToken } from "./jwt";
export { signToken, verifyToken };
import { cookies } from "next/headers";

const COOKIE_NAME = "veritas_admin_token";

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
