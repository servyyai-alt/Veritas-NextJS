import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import ContactPageSettings from "@/models/ContactPageSettings";
import { DEFAULT_CONTACT_CONTENT } from "@/lib/contact-content";

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

export function mergeContactContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeContactContent(baseItem, incoming[index]));
    if (incoming.length > base.length) merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeContactContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadContactContent() {
  noStore();

  try {
    await connectDB();
    const settings = await ContactPageSettings.findOne().lean();
    return mergeContactContent(DEFAULT_CONTACT_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_CONTACT_CONTENT);
  }
}

export async function saveContactContent(content) {
  noStore();

  await connectDB();
  const merged = mergeContactContent(DEFAULT_CONTACT_CONTENT, content);

  let settings = await ContactPageSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await ContactPageSettings.create({ content: merged });
  }

  return merged;
}

export async function resetContactContent() {
  noStore();

  await connectDB();
  let settings = await ContactPageSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await ContactPageSettings.create({ content: {} });
  }
  return mergeContactContent(DEFAULT_CONTACT_CONTENT, settings.content);
}
