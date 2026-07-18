import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const submission = await Contact.findByIdAndUpdate(id, body, { new: true });
    if (!submission) return Response.json({ success: false, message: "Not found" }, { status: 404 });
    return Response.json({ success: true, data: submission });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { id } = await params;
    await Contact.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Deleted" });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
