import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import AboutSettings from "@/models/AboutSettings";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/about-content";

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, cloneValue(val)]),
    );
  }
  return value;
}

export function mergeAboutContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeAboutContent(baseItem, incoming[index]));
    if (incoming.length > base.length) {
      merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    }
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeAboutContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadAboutContent() {
  noStore();

  try {
    await connectDB();
    const settings = await AboutSettings.findOne().lean();
    return mergeAboutContent(DEFAULT_ABOUT_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_ABOUT_CONTENT);
  }
}

export async function saveAboutContent(content) {
  noStore();

  await connectDB();
  const merged = mergeAboutContent(DEFAULT_ABOUT_CONTENT, content);

  let settings = await AboutSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await AboutSettings.create({ content: merged });
  }

  return merged;
}

export async function resetAboutContent() {
  noStore();

  await connectDB();
  let settings = await AboutSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await AboutSettings.create({ content: {} });
  }
  return mergeAboutContent(DEFAULT_ABOUT_CONTENT, settings.content);
}
