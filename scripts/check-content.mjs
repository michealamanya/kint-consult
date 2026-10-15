import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
const { entries } = JSON.parse(await readFile("content/insights.json", "utf8"));
const slugs = new Set();
const { entries: services } = JSON.parse(
  await readFile("content/services.json", "utf8"),
);
const serviceSlugs = new Set();
for (const service of services) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug) ||
    serviceSlugs.has(service.slug)
  )
    throw Error("Service slugs must be unique and URL safe");
  serviceSlugs.add(service.slug);
  for (const field of ["title", "description", "intro", "label"])
    if (typeof service[field] !== "string" || !service[field].trim())
      throw Error(`Missing service ${field}`);
  if (
    !Array.isArray(service.priorities) ||
    !service.priorities.length ||
    service.priorities.some(
      (value) => typeof value !== "string" || !value.trim(),
    )
  )
    throw Error("Service engagement areas are required");
  if (
    service.featured &&
    ["problem", "response", "outcome"].some((field) => !service[field]?.trim())
  )
    throw Error(
      "Featured advisory services require challenge, response and outcome",
    );
}
const purpose = JSON.parse(await readFile("content/company.json", "utf8"));
if (
  !purpose.mission?.trim() ||
  !purpose.vision?.trim() ||
  !Array.isArray(purpose.values) ||
  !purpose.values.length ||
  purpose.values.some((value) => typeof value !== "string" || !value.trim())
)
  throw Error("Company purpose fields are required");
for (const item of entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug))
    throw Error("Article slugs must be unique and URL safe");
  slugs.add(item.slug);
  for (const field of [
    "title",
    "description",
    "category",
    "author",
    "readTime",
  ])
    if (typeof item[field] !== "string" || !item[field].trim())
      throw Error(`Missing ${field}: ${item.slug}`);
  if (
    !["draft", "scheduled", "published"].includes(item.status) ||
    !Number.isFinite(Date.parse(item.publishedAt)) ||
    !Number.isFinite(Date.parse(item.updatedAt))
  )
    throw Error(`Invalid publication metadata: ${item.slug}`);
  if (
    !Array.isArray(item.tags) ||
    item.tags.some((tag) => typeof tag !== "string") ||
    !Array.isArray(item.sections) ||
    !item.sections.length ||
    item.sections.some(
      (section) =>
        !section.heading ||
        !section.paragraphs?.length ||
        section.paragraphs.some((p) => typeof p !== "string" || !p.trim()),
    )
  )
    throw Error(`Invalid article body: ${item.slug}`);
  if (item.image) {
    if (
      !/^\/images\/uploads\/[a-zA-Z0-9._/-]+\.(png|jpe?g|webp|avif)$/i.test(
        item.image,
      ) ||
      item.image.includes("..") ||
      !item.imageAlt?.trim()
    )
      throw Error(`Image requires a safe path and description: ${item.slug}`);
    await stat(path.join("public", item.image));
  }
}
async function checkMedia(directory) {
  let files;
  try {
    files = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const file of files) {
    const target = path.join(directory, file.name);
    if (file.isSymbolicLink()) throw Error("Media symlinks are not permitted");
    if (file.isDirectory()) {
      await checkMedia(target);
      continue;
    }
    if (
      !/\.(png|jpe?g|webp|avif)$/i.test(file.name) ||
      (await stat(target)).size > 2 * 1024 * 1024
    )
      throw Error(`Unsupported or oversized upload: ${target}`);
    const bytes = await readFile(target);
    const png = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp =
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP";
    const avif =
      bytes.toString("ascii", 4, 8) === "ftyp" &&
      ["avif", "avis"].includes(bytes.toString("ascii", 8, 12));
    const extension = path.extname(file.name).toLowerCase();
    if (
      !(extension === ".png"
        ? png
        : /^\.jpe?g$/.test(extension)
          ? jpeg
          : extension === ".webp"
            ? webp
            : avif)
    )
      throw Error(`Image signature does not match extension: ${target}`);
  }
}
await checkMedia("public/images/uploads");
console.log(`Validated ${entries.length} articles and editorial media.`);
