import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Programme from "@/models/Programme";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q) return Response.json({ success: true, blogs: [], programmes: [] });

    const regex = { $regex: q, $options: "i" };

    const [blogs, programmes] = await Promise.all([
      Blog.find({ status: { $in: ["published", "coming_soon"] }, $or: [{ title: regex }, { excerpt: regex }] })
        .limit(5).select("title slug excerpt category status").lean(),
      Programme.find({ published: true, $or: [{ title: regex }, { shortDesc: regex }] })
        .limit(5).select("title slug domainCode shortDesc").lean(),
    ]);

    return Response.json({ success: true, blogs, programmes });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
