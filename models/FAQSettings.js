import mongoose from "mongoose";

const FAQSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.FAQSettings || mongoose.model("FAQSettings", FAQSettingsSchema);
