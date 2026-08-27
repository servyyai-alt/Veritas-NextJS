import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import BookPageSettings from "@/models/BookPageSettings";
import { DEFAULT_BOOK_CONTENT } from "@/lib/book-content";

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

export function mergeBookContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeBookContent(baseItem, incoming[index]));
    if (incoming.length > base.length) merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeBookContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadBookContent() {
  noStore();

  try {
    await connectDB();
    const settings = await BookPageSettings.findOne().lean();
    return mergeBookContent(DEFAULT_BOOK_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_BOOK_CONTENT);
  }
}

export async function saveBookContent(content) {
  noStore();

  await connectDB();
  const merged = mergeBookContent(DEFAULT_BOOK_CONTENT, content);

  let settings = await BookPageSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await BookPageSettings.create({ content: merged });
  }

  return merged;
}

export async function resetBookContent() {
  noStore();

  await connectDB();
  let settings = await BookPageSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await BookPageSettings.create({ content: {} });
  }
  return mergeBookContent(DEFAULT_BOOK_CONTENT, settings.content);
}
