import { getAuthUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return Response.json({ success: false, message: "No file provided" }, { status: 400 });

    if (!(file instanceof File) || !ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ success: false, message: "Invalid image type" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ success: false, message: "Image must be 4 MB or smaller" }, { status: 400 });
    }

    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME
      && process.env.CLOUDINARY_API_KEY
      && process.env.CLOUDINARY_API_SECRET;
    if (!hasCloudinaryConfig) {
      return Response.json(
        {
          success: false,
          message: "Image storage is not configured. Add the Cloudinary environment variables.",
        },
        { status: 503 },
      );
    }

    const bytes = await file.arrayBuffer();
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "veritas/homepage",
          resource_type: "image",
          type: "upload",
          use_filename: false,
          unique_filename: true,
          overwrite: false,
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        },
      );
      upload.end(Buffer.from(bytes));
    });

    return Response.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
