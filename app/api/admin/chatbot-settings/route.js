import { connectDB } from "@/lib/mongodb";
import CrmSettings from "@/models/CrmSettings";
import { getAuthUser } from "@/lib/auth";

function sanitizeUrl(str) {
  try {
    const url = new URL(str);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {}
  return null;
}

export async function GET() {
  try {
    await connectDB();
    const settings = await CrmSettings.findOne().lean();
    return Response.json({
      success: true,
      chatbotUrl: settings?.chatbotUrl || "",
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

    const { chatbotUrl } = await req.json();

    if (!chatbotUrl || !chatbotUrl.trim()) {
      return Response.json({ success: false, message: "URL is required" }, { status: 400 });
    }

    const sanitized = sanitizeUrl(chatbotUrl.trim());
    if (!sanitized) {
      return Response.json({ success: false, message: "Invalid URL. Only http:// and https:// URLs are allowed." }, { status: 400 });
    }

    await connectDB();
    const settings = await CrmSettings.findOne();
    if (settings) {
      settings.chatbotUrl = sanitized;
      await settings.save();
    } else {
      await CrmSettings.create({ chatbotUrl: sanitized });
    }

    return Response.json({ success: true, chatbotUrl: sanitized });
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
    const settings = await CrmSettings.findOne();
    if (settings) {
      settings.chatbotUrl = "";
      await settings.save();
    }

    return Response.json({ success: true, message: "Chatbot URL removed" });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
