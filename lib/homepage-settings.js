import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import HomepageSettings from "@/models/HomepageSettings";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/homepage-content";

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cloneValue(val)]));
  }
  return value;
}

export function mergeHomepageContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) {
      return cloneValue(base);
    }
    const merged = base.map((baseItem, index) => mergeHomepageContent(baseItem, incoming[index]));
    if (incoming.length > base.length) {
      merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    }
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeHomepageContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadHomepageContent() {
  noStore();

  try {
    await connectDB();
    const settings = await HomepageSettings.findOne().lean();
    return mergeHomepageContent(DEFAULT_HOMEPAGE_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_HOMEPAGE_CONTENT);
  }
}

export async function saveHomepageContent(content) {
  noStore();

  await connectDB();
  const merged = mergeHomepageContent(DEFAULT_HOMEPAGE_CONTENT, content);

  let settings = await HomepageSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await HomepageSettings.create({ content: merged });
  }

  return merged;
}

export async function resetHomepageContent() {
  noStore();

  await connectDB();
  let settings = await HomepageSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await HomepageSettings.create({ content: {} });
  }
  return mergeHomepageContent(DEFAULT_HOMEPAGE_CONTENT, settings.content);
}
