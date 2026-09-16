import mongoose from "mongoose";

const BrochureSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Brochure || mongoose.model("Brochure", BrochureSchema);
