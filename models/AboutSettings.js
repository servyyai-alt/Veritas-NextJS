import mongoose from "mongoose";

const AboutSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.AboutSettings ||
  mongoose.model("AboutSettings", AboutSettingsSchema);
