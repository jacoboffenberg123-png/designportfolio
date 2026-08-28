/**
 * One-off: swaps the Diplom-Is before/after marks for a higher-resolution pair.
 *
 * The first pair scaled the old mark down to 89% to make the two cap-heights
 * match. This one scales the wordmark up instead, so the mascot — the only
 * detail-heavy artwork on the page — stays at its native 502px. New filenames
 * rather than a file replacement, so no CDN cache can serve the old bytes.
 *
 * Run from apps/cms: npx payload run scripts/update-diplom-logos.ts
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(here, "../../../design/cms-upload");
const SLUG = "diplom-is";

const PAIR = {
  before: { file: "diplom-logo-for.png", alt: "Diplom-Is' gamle logo: maskot over ordmerket" },
  after: { file: "diplom-logo-etter.png", alt: "Diplom-Is' nye ordmerke, uten maskot" },
};

const payload = await getPayload({ config });

async function upload({ file, alt }: { file: string; alt: string }): Promise<number> {
  const found = await payload.find({
    collection: "media",
    where: { filename: { equals: file } },
    limit: 1,
  });
  if (found.docs[0]) {
    console.log(`  = ${file} (fantes, id ${found.docs[0].id})`);
    return found.docs[0].id as number;
  }
  const doc = await payload.create({ collection: "media", data: { alt }, filePath: path.join(IMAGES, file) });
  console.log(`  + ${file} → id ${doc.id}`);
  return doc.id as number;
}

console.log("Laster opp logoparet:");
const before = await upload(PAIR.before);
const after = await upload(PAIR.after);

const found = await payload.find({
  collection: "projects",
  where: { slug: { equals: SLUG } },
  limit: 1,
});
const project = found.docs[0];
if (!project) throw new Error(`Fant ikke prosjektet «${SLUG}»`);

await payload.update({
  collection: "projects",
  id: project.id,
  // Only the two uploads change; the captions stay as they are.
  data: { logo: { ...project.logo, before, after } },
});
console.log(`\n✓ «${SLUG}» peker nå på id ${before} og ${after}`);

process.exit(0);
