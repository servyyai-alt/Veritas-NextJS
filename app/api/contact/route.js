import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const read = searchParams.get("read");
    const source = searchParams.get("source") || "";

    const filter = {};
    if (q) filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
    if (read === "true") filter.read = true;
    if (read === "false") filter.read = false;
    if (source) filter.source = source;

    const submissions = await Contact.find(filter).sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, data: submissions });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone } = body;
    if (!name || !phone)
      return Response.json({ success: false, message: "Name and phone required" }, { status: 400 });

    const submission = await Contact.create(body);

    return Response.json({ success: true, message: "Submitted", data: submission }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
