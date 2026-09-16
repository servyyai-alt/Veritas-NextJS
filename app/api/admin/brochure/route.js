import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Brochure from "@/models/Brochure";

export async function POST(req) {
  try {
    if (!(await getAuthUser())) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
      return Response.json({ success: false, message: "Please select a PDF brochure" }, { status: 400 });
    }
    if (!file.size || file.size > 4 * 1024 * 1024) {
      return Response.json({ success: false, message: "PDF must be non-empty and 4 MB or smaller" }, { status: 400 });
    }
    const data = Buffer.from(await file.arrayBuffer());
    if (data.subarray(0, 5).toString() !== "%PDF-") {
      return Response.json({ success: false, message: "The file is not a valid PDF" }, { status: 400 });
    }
    const filename = `${file.name.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 100) || "brochure"}.pdf`;
    await connectDB();
    const brochure = await Brochure.create({ filename, data });
    return Response.json({ success: true, brochure: { id: brochure._id.toString(), filename } });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Brochure upload failed. Please try again." }, { status: 500 });
  }
}
