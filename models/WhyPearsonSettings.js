import mongoose from "mongoose";

const WhyPearsonSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.WhyPearsonSettings ||
  mongoose.model("WhyPearsonSettings", WhyPearsonSettingsSchema);
