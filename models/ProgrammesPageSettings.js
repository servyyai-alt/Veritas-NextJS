import mongoose from "mongoose";

const ProgrammesPageSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.ProgrammesPageSettings ||
  mongoose.model("ProgrammesPageSettings", ProgrammesPageSettingsSchema);
