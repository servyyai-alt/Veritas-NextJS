import { getAuthUser } from "@/lib/auth";
import { loadHomepageContent, resetHomepageContent, saveHomepageContent } from "@/lib/homepage-settings";
import { connectDB } from "@/lib/mongodb";
import Brochure from "@/models/Brochure";

export async function GET() {
  try {
    const content = await loadHomepageContent();
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
    if (!body || !body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
      return Response.json({ success: false, message: "Content must be an object" }, { status: 400 });
    }

    if (body.content.brochure?.id) {
      const id = body.content.brochure.id;
      if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) {
        return Response.json({ success: false, message: "Invalid brochure. Please upload a PDF again." }, { status: 400 });
      }
      await connectDB();
      const brochure = await Brochure.findById(id).select("filename");
      if (!brochure) {
        return Response.json({ success: false, message: "Brochure not found. Please upload it again." }, { status: 400 });
      }
      body.content.brochure = { id, filename: brochure.filename };
    }

    const content = await saveHomepageContent(body.content);
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

    const content = await resetHomepageContent();
    return Response.json({ success: true, content, message: "Homepage content reset to defaults" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
