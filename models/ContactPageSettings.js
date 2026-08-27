import mongoose from "mongoose";

const ContactPageSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.ContactPageSettings || mongoose.model("ContactPageSettings", ContactPageSettingsSchema);
