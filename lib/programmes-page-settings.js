import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import ProgrammesPageSettings from "@/models/ProgrammesPageSettings";
import { DEFAULT_PROGRAMMES_PAGE_CONTENT } from "@/lib/programmes-page-content";

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

export function mergeProgrammesPageContent(base, incoming) {
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming)) return cloneValue(base);
    const merged = base.map((baseItem, index) => mergeProgrammesPageContent(baseItem, incoming[index]));
    if (incoming.length > base.length) merged.push(...incoming.slice(base.length).map((item) => cloneValue(item)));
    return merged;
  }

  if (isPlainObject(base)) {
    const next = {};
    for (const [key, baseValue] of Object.entries(base)) {
      next[key] = mergeProgrammesPageContent(baseValue, isPlainObject(incoming) ? incoming[key] : undefined);
    }
    return next;
  }

  return typeof incoming === typeof base ? incoming : base;
}

export async function loadProgrammesPageContent() {
  noStore();
  try {
    await connectDB();
    const settings = await ProgrammesPageSettings.findOne().lean();
    return mergeProgrammesPageContent(DEFAULT_PROGRAMMES_PAGE_CONTENT, settings?.content);
  } catch (err) {
    console.error(err);
    return cloneValue(DEFAULT_PROGRAMMES_PAGE_CONTENT);
  }
}

export async function saveProgrammesPageContent(content) {
  noStore();
  await connectDB();
  const merged = mergeProgrammesPageContent(DEFAULT_PROGRAMMES_PAGE_CONTENT, content);

  let settings = await ProgrammesPageSettings.findOne();
  if (settings) {
    settings.content = merged;
    await settings.save();
  } else {
    settings = await ProgrammesPageSettings.create({ content: merged });
  }

  return merged;
}

export async function resetProgrammesPageContent() {
  noStore();
  await connectDB();
  let settings = await ProgrammesPageSettings.findOne();
  if (settings) {
    settings.content = {};
    await settings.save();
  } else {
    settings = await ProgrammesPageSettings.create({ content: {} });
  }
  return mergeProgrammesPageContent(DEFAULT_PROGRAMMES_PAGE_CONTENT, settings.content);
}
