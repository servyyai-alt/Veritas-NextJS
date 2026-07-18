import { cookies } from "next/headers";
import { COOKIE_NAME_EXPORT } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME_EXPORT);
  return Response.json({ success: true, message: "Logged out" });
}
