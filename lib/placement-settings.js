import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import PlacementSettings from "@/models/PlacementSettings";
import { DEFAULT_PLACEMENT_CONTENT } from "@/lib/placement-content";

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

export function mergePlacementContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergePlacementContent(baseItem, incoming[index]));
    if (incoming.length > base.length) {
      merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    }
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergePlacementContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadPlacementContent() {
  noStore();

  try {
    await connectDB();
    const settings = await PlacementSettings.findOne().lean();
    return mergePlacementContent(DEFAULT_PLACEMENT_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_PLACEMENT_CONTENT);
  }
}

export async function savePlacementContent(content) {
  noStore();

  await connectDB();
  const merged = mergePlacementContent(DEFAULT_PLACEMENT_CONTENT, content);

  let settings = await PlacementSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await PlacementSettings.create({ content: merged });
  }

  return merged;
}

export async function resetPlacementContent() {
  noStore();

  await connectDB();
  let settings = await PlacementSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await PlacementSettings.create({ content: {} });
  }
  return mergePlacementContent(DEFAULT_PLACEMENT_CONTENT, settings.content);
}
