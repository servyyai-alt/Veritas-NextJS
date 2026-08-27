import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import FAQSettings from "@/models/FAQSettings";
import { DEFAULT_FAQ_CONTENT } from "@/lib/faq-content";

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

export function mergeFAQContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeFAQContent(baseItem, incoming[index]));
    if (incoming.length > base.length) merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeFAQContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadFAQContent() {
  noStore();
  try {
    await connectDB();
    const settings = await FAQSettings.findOne().lean();
    return mergeFAQContent(DEFAULT_FAQ_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_FAQ_CONTENT);
  }
}

export async function saveFAQContent(content) {
  noStore();
  await connectDB();
  const merged = mergeFAQContent(DEFAULT_FAQ_CONTENT, content);

  let settings = await FAQSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await FAQSettings.create({ content: merged });
  }

  return merged;
}

export async function resetFAQContent() {
  noStore();
  await connectDB();
  let settings = await FAQSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await FAQSettings.create({ content: {} });
  }
  return mergeFAQContent(DEFAULT_FAQ_CONTENT, settings.content);
}
