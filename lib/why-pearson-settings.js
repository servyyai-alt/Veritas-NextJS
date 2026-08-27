import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import WhyPearsonSettings from "@/models/WhyPearsonSettings";
import { DEFAULT_WHY_PEARSON_CONTENT } from "@/lib/why-pearson-content";

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

export function mergeWhyPearsonContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) {
      return cloneValue(base);
    }
    const merged = base.map((baseItem, index) =>
      mergeWhyPearsonContent(baseItem, incoming[index]),
    );
    if (incoming.length > base.length) {
      merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    }
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeWhyPearsonContent(
        baseValue,
        isPlainObject(incoming) ? incoming[key] : undefined,
      );
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadWhyPearsonContent() {
  noStore();

  try {
    await connectDB();
    const settings = await WhyPearsonSettings.findOne().lean();
    return mergeWhyPearsonContent(DEFAULT_WHY_PEARSON_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_WHY_PEARSON_CONTENT);
  }
}

export async function saveWhyPearsonContent(content) {
  noStore();

  await connectDB();
  const merged = mergeWhyPearsonContent(DEFAULT_WHY_PEARSON_CONTENT, content);

  let settings = await WhyPearsonSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await WhyPearsonSettings.create({ content: merged });
  }

  return merged;
}

export async function resetWhyPearsonContent() {
  noStore();

  await connectDB();
  let settings = await WhyPearsonSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await WhyPearsonSettings.create({ content: {} });
  }
  return mergeWhyPearsonContent(DEFAULT_WHY_PEARSON_CONTENT, settings.content);
}
