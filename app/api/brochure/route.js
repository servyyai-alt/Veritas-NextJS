import { loadHomepageContent } from "@/lib/homepage-settings";
import Brochure from "@/models/Brochure";

export async function GET() {
  try {
    const content = await loadHomepageContent();
    const id = content.brochure.id;
    const brochure = /^[a-f0-9]{24}$/i.test(id) ? await Brochure.findById(id) : null;
    if (!brochure) {
      return Response.json({ message: "No brochure is currently available" }, { status: 404 });
    }
    return new Response(new Uint8Array(brochure.data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${brochure.filename}"`,
        "Content-Length": String(brochure.data.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Unable to download the brochure. Please try again." }, { status: 500 });
  }
}
