import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ success: false }, { status: 401 });
  return Response.json({ success: true, user });
}
