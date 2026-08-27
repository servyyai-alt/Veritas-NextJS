import { getAuthUser } from "@/lib/auth";
import { loadBookContent, resetBookContent, saveBookContent } from "@/lib/book-settings";

export async function GET() {
  try {
    const content = await loadBookContent();
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

    const { content } = await req.json();
    if (!content) {
      return Response.json({ success: false, message: "Content is required" }, { status: 400 });
    }

    const saved = await saveBookContent(content);
    return Response.json({ success: true, content: saved });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const content = await resetBookContent();
    return Response.json({ success: true, content });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
