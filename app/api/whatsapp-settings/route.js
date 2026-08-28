import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import WhatsAppSettings from "@/models/WhatsAppSettings";

function normalizePhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    return null;
  }
  return digits;
}

export async function GET() {
  try {
    await connectDB();
    const settings = await WhatsAppSettings.findOne().lean();
    return Response.json({
      success: true,
      phoneNumber: settings?.phoneNumber || "",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const normalized = normalizePhoneNumber(body?.phoneNumber);

    if (!normalized) {
      return Response.json(
        { success: false, message: "Enter a valid WhatsApp number with country code." },
        { status: 400 },
      );
    }

    await connectDB();
    const settings = await WhatsAppSettings.findOne();
    if (settings) {
      settings.phoneNumber = normalized;
      await settings.save();
    } else {
      await WhatsAppSettings.create({ phoneNumber: normalized });
    }

    return Response.json({ success: true, phoneNumber: normalized });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const settings = await WhatsAppSettings.findOne();
    if (settings) {
      settings.phoneNumber = "";
      await settings.save();
    }

    return Response.json({ success: true, message: "WhatsApp number removed" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
