import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const submissions = await Contact.find().sort({ createdAt: -1 }).lean();

    const headers = ["Name", "Phone", "Email", "Subject", "Message", "Source", "Read", "Submitted At"];
    const rows = submissions.map((s) => [
      s.name || "",
      s.phone || "",
      s.email || "",
      s.subject || "",
      (s.message || "").replace(/,/g, ";").replace(/\n/g, " "),
      s.source || "",
      s.read ? "Yes" : "No",
      new Date(s.createdAt).toLocaleString("en-IN"),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="contact-submissions-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
