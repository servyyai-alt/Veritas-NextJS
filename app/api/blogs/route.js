import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getAuthUser } from "@/lib/auth";
import { createSlug } from "@/lib/slug";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const user = await getAuthUser();
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";

    const filter = {};
    // Public: show published + coming_soon only
    if (!user) filter.status = { $in: ["published", "coming_soon"] };
    if (status) filter.status = status;
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
    ];

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, data: blogs });
  } catch (err) {
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
    const existing = await Blog.findOne({ slug: body.slug });
    if (existing) body.slug = body.slug + "-" + Date.now();

    if (body.status === "published" && !body.publishedAt) body.publishedAt = new Date();

    const blog = await Blog.create(body);
    return Response.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
