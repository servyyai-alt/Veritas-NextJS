import mongoose from "mongoose";

const BookPageSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.BookPageSettings || mongoose.model("BookPageSettings", BookPageSettingsSchema);
