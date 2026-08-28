/**
 * One-off: rebuilds the Diplom-Is case study on the Argumentet layout.
 *
 * Run with `npx payload run scripts/seed-diplom-is.ts` from apps/cms. It is
 * idempotent — media is matched by filename and the project by slug, so a
 * second run updates rather than duplicates.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(here, "../../../design/cms-upload");

const OLD_SLUG = "Deplom-Is";
const SLUG = "diplom-is";

type Upload = { file: string; alt: string };

const MEDIA: Record<string, Upload> = {
  logoFor: { file: "logo-for.png", alt: "Diplom-Is' gamle logo: maskot over ordmerket" },
  logoEtter: { file: "logo-etter.png", alt: "Diplom-Is' nye ordmerke, uten maskot" },
  elSjokolade: { file: "element-sjokolade.png", alt: "Emballasjefront, sjokolade" },
  elJordbaer: { file: "element-jordbaer.png", alt: "Emballasjefront, jordbær" },
  elPistasj: { file: "element-pistasj.png", alt: "Emballasjefront, pistasj" },
  sjokolade: { file: "diplom-sjokolade.png", alt: "Sjokoladeesken på gul bakgrunn" },
  jordbaer: { file: "diplom-jordbaer.png", alt: "Jordbæresken på rosa bakgrunn" },
  pistasj: { file: "diplom-pistasj.png", alt: "Pistasjesken på grønn bakgrunn" },
  tressIs: { file: "diplom-tress-is.png", alt: "Tress Is-esken på rosa bakgrunn" },
  sandwich: { file: "diplom-sandwich.png", alt: "Sandwich-esken på blå bakgrunn" },
  lollipop: { file: "diplom-lollipop.png", alt: "Lollipop-esken på oransje bakgrunn" },
};

const payload = await getPayload({ config });

/** Reuses an existing upload with the same filename instead of piling up copies. */
async function upload(key: string, { file, alt }: Upload): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: file } },
    limit: 1,
  });
  if (existing.docs[0]) {
    console.log(`  = ${file} (fantes, id ${existing.docs[0].id})`);
    return existing.docs[0].id as number;
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
const id: Record<string, number> = {};
for (const [key, spec] of Object.entries(MEDIA)) id[key] = await upload(key, spec);

// The hero already exists — it's the 3x3 mockup the renders were cut from.
const hero = await payload.find({
  collection: "media",
  where: { filename: { equals: "DIPLOMIS-1.png" } },
  limit: 1,
});
const coverImage = hero.docs[0]?.id as number | undefined;
if (!coverImage) throw new Error("Fant ikke DIPLOMIS-1.png — hero mangler");

const data = {
  layout: "argumentet" as const,
  title: "Diplom-Is Redesign",
  slug: SLUG,
  coverImage,
  category: "Merkevare og visuell identitet",
  year: "2025",
  subject: "Merkevarebygging og emballasjedesign",
  duration: "4 uker",
  tools: "Figma, Illustrator",
  order: 0,
  intro:
    "Diplom-Is ville kommunisere «arven» og «god gammeldags islykke». Jeg valgte å " +
    "utfordre briefen. Målet ble å flytte Diplom-Is mot «affordable luxury».\n\n" +
    "Beholde sjelen, men fjerne alt annet.",
  angle:
    "Briefen ba om arv og nostalgi. Jeg leste markedet annerledes: kategorien er full " +
    "av maskoter og farger, og et billigsegment er vanskelig å vokse ut av. Så jeg " +
    "snudde oppgaven — hva om Diplom-Is så ut som noe du kjøper fordi det roper " +
    "luksus, ikke fordi det er billig?",
  strategy: [
    { label: "Posisjon", value: "Fra dagens posisjon til kvalitet og premium følelse" },
    { label: "Forbruker", value: "Unge voksne" },
    { label: "Uttrykk", value: "Minimalistisk, taktilt, enkel typografi og tydelig hierarki" },
    { label: "Prinsipp", value: "Perfeksjon nås når det ikke er mer å fjerne" },
  ],
  logo: {
    before: id.logoFor,
    beforeNote: "Maskot og ordmerke. Lekent, men barnevennlig.",
    after: id.logoEtter,
    afterNote: "Kun ordmerke. Minimalistisk, helt nytt uttrykk.",
  },
  carrier: {
    heading: "Bærende element",
    lead: "Den smeltende is-kulen gir et blikkfang i hver smak.",
    items: [
      { image: id.elSjokolade, label: "Sjokolade" },
      { image: id.elJordbaer, label: "Jordbær" },
      { image: id.elPistasj, label: "Pistasj" },
    ],
  },
  // «Endelig design» — the three core flavours, in the order the carrier row uses.
  gallery: [
    { image: id.sjokolade },
    { image: id.jordbaer },
    { image: id.pistasj },
  ],
  designNote:
    "Emballasjen holder på ett grep: sort flate, hvit logo, og is-kulen som eneste " +
    "fargebærer. Det gjør serien lett å utvide — en ny smak trenger bare en ny kule, " +
    "ikke et nytt design. I hylla står de som en samlet blokk i stedet for tre " +
    "enkeltprodukter.",
  special: {
    heading: "Designforslag til spesial-is",
    images: [{ image: id.tressIs }, { image: id.sandwich }, { image: id.lollipop }],
  },
  reflection:
    "Det viktigste jeg tok med meg var verdien av å utfordre en brief i stedet for å " +
    "bare svare på den. Kartleggingen av markedet ga meg et argument for å gå mot " +
    "kategorien, og da ble det et begrunnet valg og ikke en smaksak. Samtidig lærte " +
    "jeg at det å utfordre ikke er det samme som å overse. De kravene jeg satte til " +
    "side i starten, arven og gjenkjenneligheten, måtte løses uansett, bare på en " +
    "annen måte enn briefen så for seg.\n\n" +
    "Jeg lærte også hvor mye assosiasjoner styrer lesningen av en form. Ismotivet var " +
    "teknisk sett riktig lenge før det ble riktig, fordi folk så lepper og hjelmer i " +
    "det. Det var først da jeg testet formen på andre og lyttet til hva de faktisk så, " +
    "at den løsnet.",
};

const existing = await payload.find({
  collection: "projects",
  where: { slug: { equals: SLUG } },
  limit: 1,
});

if (existing.docs[0]) {
  await payload.update({ collection: "projects", id: existing.docs[0].id, data });
  console.log(`\n✓ Oppdaterte «${SLUG}» (id ${existing.docs[0].id})`);
} else {
  const doc = await payload.create({ collection: "projects", data });
  console.log(`\n✓ Opprettet «${SLUG}» (id ${doc.id})`);
}

// The old entry carried a misspelled slug and the previous layout. Removed last,
// so nothing is lost if the write above fails.
const old = await payload.find({
  collection: "projects",
  where: { slug: { equals: OLD_SLUG } },
  limit: 1,
});
if (old.docs[0]) {
  await payload.delete({ collection: "projects", id: old.docs[0].id });
  console.log(`✓ Fjernet det gamle prosjektet «${OLD_SLUG}» (id ${old.docs[0].id}). Mediefilene er urørt.`);
} else {
  console.log(`  «${OLD_SLUG}» fantes ikke — ingenting å fjerne.`);
}

process.exit(0);
