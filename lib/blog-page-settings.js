import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import BlogPageSettings from "@/models/BlogPageSettings";
import { DEFAULT_BLOG_PAGE_CONTENT } from "@/lib/blog-page-content";

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map((item) => cloneValue(item));
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cloneValue(val)]));
  }
  return value;
}

export function mergeBlogPageContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeBlogPageContent(baseItem, incoming[index]));
    if (incoming.length > base.length) merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeBlogPageContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadBlogPageContent() {
  noStore();
  try {
    await connectDB();
    const settings = await BlogPageSettings.findOne().lean();
    return mergeBlogPageContent(DEFAULT_BLOG_PAGE_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_BLOG_PAGE_CONTENT);
  }
}

export async function saveBlogPageContent(content) {
  noStore();
  await connectDB();
  const merged = mergeBlogPageContent(DEFAULT_BLOG_PAGE_CONTENT, content);

  let settings = await BlogPageSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await BlogPageSettings.create({ content: merged });
  }

  return merged;
}

export async function resetBlogPageContent() {
  noStore();
  await connectDB();
  let settings = await BlogPageSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await BlogPageSettings.create({ content: {} });
  }
  return mergeBlogPageContent(DEFAULT_BLOG_PAGE_CONTENT, settings.content);
}
