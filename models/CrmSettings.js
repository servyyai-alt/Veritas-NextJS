import mongoose from "mongoose";

const CrmSettingsSchema = new mongoose.Schema(
  {
    contactFormUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.CrmSettings || mongoose.model("CrmSettings", CrmSettingsSchema);
