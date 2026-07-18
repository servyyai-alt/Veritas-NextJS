import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { signToken, COOKIE_NAME_EXPORT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return Response.json({ success: false, message: "Email and password required" }, { status: 400 });

    await connectDB();

    // Seed admin if none exists
    let admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Check env credentials for first-time seed
      if (
        email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase() &&
        password === process.env.ADMIN_PASSWORD
      ) {
        admin = await Admin.create({
          name: "Admin",
          email: email.toLowerCase(),
          password,
        });
      } else {
        return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
      }
    }

    const valid = await admin.comparePassword(password);
    if (!valid)
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return Response.json({ success: true, message: "Logged in", admin: { name: admin.name, email: admin.email } });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
