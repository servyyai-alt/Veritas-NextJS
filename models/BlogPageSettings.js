import mongoose from "mongoose";

const BlogPageSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.BlogPageSettings ||
  mongoose.model("BlogPageSettings", BlogPageSettingsSchema);
