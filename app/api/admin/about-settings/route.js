import { getAuthUser } from "@/lib/auth";
import { loadAboutContent, resetAboutContent, saveAboutContent } from "@/lib/about-settings";

export async function GET() {
  try {
    const content = await loadAboutContent();
    return Response.json({ success: true, content });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body || typeof body.content !== "object" || Array.isArray(body.content)) {
      return Response.json({ success: false, message: "Content must be an object" }, { status: 400 });
    }

    const content = await saveAboutContent(body.content);
    return Response.json({ success: true, content });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const content = await resetAboutContent();
    return Response.json({ success: true, content, message: "About content reset to defaults" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
