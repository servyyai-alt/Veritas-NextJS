import mongoose from "mongoose";

const WhatsAppSettingsSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.WhatsAppSettings ||
  mongoose.model("WhatsAppSettings", WhatsAppSettingsSchema);
