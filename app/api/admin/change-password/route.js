import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ success: false, message: "New password must be at least 6 characters" }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return Response.json({ success: false, message: "New password must be different from current password" }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findById(user.id);
    if (!admin) return Response.json({ success: false, message: "Admin not found" }, { status: 404 });

    const valid = await admin.comparePassword(currentPassword);
    if (!valid) {
      return Response.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
    }

    admin.password = newPassword;
    await admin.save();

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
