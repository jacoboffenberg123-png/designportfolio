/**
 * One-off: creates the "Porteføljen som prosjekt" case on the Systemet layout.
 *
 * Run from apps/cms: npx payload run scripts/seed-systemet.ts
 * Idempotent — media matches on filename, the project on slug.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(here, "../../../design/cms-upload");
const SLUG = "portefoljen-som-prosjekt";

const MEDIA = {
  desktop: { file: "system-desktop.png", alt: "Prosjektoversikten på desktop" },
  phone: { file: "system-telefon.png", alt: "Prosjektoversikten på telefon" },
  card: { file: "system-kort.png", alt: "Utsnitt av porteføljens forside" },
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
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath: path.join(IMAGES, file),
  });
  console.log(`  + ${file} → id ${doc.id}`);
  return doc.id as number;
}

console.log("Laster opp bilder:");
const desktop = await upload(MEDIA.desktop);
const phone = await upload(MEDIA.phone);
const card = await upload(MEDIA.card);

const data = {
  layout: "systemet" as const,
  title: "Porteføljen som prosjekt",
  slug: SLUG,
  // The layout draws no hero — the subject is the page you're already on — but
  // the field is required and the overview card falls back to it.
  coverImage: desktop,
  cardImage: card,
  category: "Design og utvikling",
  year: "2026",
  subject: "Designsystem og frontend",
  duration: "9 dager",
  tools: "Figma, Claude Code, Next.js, Payload",
  order: 1,
  intro:
    "Denne nettsiden er ikke bare stedet arbeidet mitt ligger — den er også ett av " +
    "prosjektene. Jeg tegnet den i Figma og bygget den i kode sammen med en AI-agent i " +
    "terminalen, med et CMS bak så innholdet kan endres uten å røre koden.\n\n" +
    "Målet var å finne ut hva som faktisk skjer med et designsystem når det møter kode, " +
    "og hva som kreves for å drifte en side selv.",
  angle:
    "En portefølje viser som regel resultater. Denne viser også hvordan den ble til.\n\n" +
    "Jeg hadde ikke skrevet en linje React da jeg begynte. I stedet for å lære syntaks " +
    "først, jobbet jeg som designer mot en agent som skrev koden — og oppdaget at jobben " +
    "min ble å avgjøre hva som var riktig, ikke å huske hvordan det staves. Det ligger " +
    "nærmere UX-arbeid enn jeg trodde: du beskriver en intensjon, tester det som kommer " +
    "ut, og retter det som ikke stemmer.",
  // Order matters: the layout reads the first as desktop and the second as phone.
  gallery: [{ image: desktop }, { image: phone }],
  reflection:
    "Det mest overraskende var hvor mye av jobben som ble å beskrive presist. Agenten " +
    "skriver koden, men den kan ikke avgjøre om 20 piksler er riktig — og den tar feil " +
    "hvis jeg beskriver noe upresist. Halvparten av arbeidet ble å bygge et vokabular vi " +
    "begge kunne stole på: navngitte tokens, en spacing-skala, komponenter med faste " +
    "navn.\n\n" +
    "Jeg lærte også å måle i stedet for å se. Da headeren begynte å riste, holdt det ikke " +
    "å si «den hopper» — vi målte 71 retningsskift i sekundet, og først da ble årsaken " +
    "tydelig. Det er samme instinkt som i brukertesting: observasjonen er verdiløs til du " +
    "vet hva som faktisk skjedde.",
};

const existing = await payload.find({
  collection: "projects",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

if (existing.docs[0]) {
  const current = existing.docs[0] as unknown as { gallery?: unknown[] };
  await payload.update({
    collection: "projects",
    id: existing.docs[0].id,
    // Images get picked by hand in the admin; a re-run shouldn't undo that.
    data: { ...data, gallery: current.gallery?.length ? current.gallery : data.gallery } as typeof data,
  });
  console.log(`\n✓ Oppdaterte «${SLUG}» (id ${existing.docs[0].id})`);
} else {
  const doc = await payload.create({ collection: "projects", data });
  console.log(`\n✓ Opprettet «${SLUG}» (id ${doc.id})`);
}

process.exit(0);
