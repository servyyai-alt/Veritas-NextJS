import { getAuthUser } from "@/lib/auth";
import { loadBlogPageContent, resetBlogPageContent, saveBlogPageContent } from "@/lib/blog-page-settings";

export async function GET() {
  try {
    const content = await loadBlogPageContent();
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

    const content = await saveBlogPageContent(body.content);
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

    const content = await resetBlogPageContent();
    return Response.json({ success: true, content, message: "Blog page content reset to defaults" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
