import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "Careers" },
    excerpt: String,
    content: String,
    image: String,
    author: { type: String, default: "Veritas Team" },
    status: {
      type: String,
      enum: ["published", "draft", "coming_soon"],
      default: "draft",
    },
    scheduledAt: Date,
    publishedAt: Date,
    metaTitle: String,
    metaDesc: String,
    relatedSlugs: [String],
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
