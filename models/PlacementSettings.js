import mongoose from "mongoose";

const PlacementSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.PlacementSettings ||
  mongoose.model("PlacementSettings", PlacementSettingsSchema);
