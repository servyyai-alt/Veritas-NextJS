import { connectDB } from "@/lib/mongodb";
import Programme from "@/models/Programme";
import { getAuthUser } from "@/lib/auth";
import { createSlug } from "@/lib/slug";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // Support lookup by slug or _id
    const programme = await Programme.findOne({
      $or: [{ slug: id }, ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : [])],
    }).lean();
    if (!programme) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, data: programme });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.slug) body.slug = createSlug(body.slug);

    const programme = await Programme.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!programme) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, data: programme });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    await Programme.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Deleted" });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
