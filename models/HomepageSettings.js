import mongoose from "mongoose";

const HomepageSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.HomepageSettings || mongoose.model("HomepageSettings", HomepageSettingsSchema);
