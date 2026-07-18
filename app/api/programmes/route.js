import { connectDB } from "@/lib/mongodb";
import Programme from "@/models/Programme";
import { getAuthUser } from "@/lib/auth";
import { createSlug } from "@/lib/slug";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const admin = await getAuthUser();
    const q = searchParams.get("q") || "";
    const all = searchParams.get("all") === "1"; // admin fetch

    const filter = {};
    if (!admin && !all) filter.published = true;
    if (q) filter.title = { $regex: q, $options: "i" };

    const programmes = await Programme.find(filter).sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, data: programmes });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    if (!body.title) return Response.json({ success: false, message: "Title required" }, { status: 400 });

    body.slug = body.slug ? createSlug(body.slug) : createSlug(body.title);

    // Ensure slug is unique
    const existing = await Programme.findOne({ slug: body.slug });
    if (existing) body.slug = body.slug + "-" + Date.now();

    const programme = await Programme.create(body);
    return Response.json({ success: true, data: programme }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
