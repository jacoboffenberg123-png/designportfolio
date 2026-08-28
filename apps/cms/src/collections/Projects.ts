import type { CollectionConfig } from "payload";

/** Which page template renders this project. */
const LAYOUTS = [
  { label: "Bildeledet — store bilder, lite tekst", value: "bildeledet" },
  { label: "Katalog — en serie objekter, nummerert", value: "katalog" },
  { label: "Argumentet — merkevarecase: vinkling, strategi, før/etter", value: "argumentet" },
  { label: "Systemet — hvordan noe er bygget: diagrammer og levende komponenter", value: "systemet" },
] as const;

// Falls back to the default rather than reading undefined: on the create form
// the value isn't written until the field is touched, and a bare `!== "katalog"`
// would then show Bildeledet's fields on every layout.
const layoutOf = (data: { layout?: string }) => data?.layout ?? "bildeledet";
const isKatalog = (data: { layout?: string }) => layoutOf(data) === "katalog";
const isBildeledet = (data: { layout?: string }) => layoutOf(data) === "bildeledet";
const isArgumentet = (data: { layout?: string }) => layoutOf(data) === "argumentet";
const isSystemet = (data: { layout?: string }) => layoutOf(data) === "systemet";

export const Projects: CollectionConfig = {
  slug: "projects",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "layout", "category", "year", "order"],
  },
  fields: [
    {
      name: "layout",
      type: "select",
      required: true,
      defaultValue: "bildeledet",
      options: [...LAYOUTS],
      admin: {
        position: "sidebar",
        description:
          "Bestemmer hvordan siden settes opp. Feltene under tilpasser seg valget.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Brukes i URL-en: /arbeid/[slug]. Kun små bokstaver og bindestrek.",
      },
    },
    {
      name: "intro",
      type: "textarea",
      admin: {
        description:
          "Vises under «Om prosjektet», ved siden av faktatabellen. To–tre setninger: " +
          "hva var oppgaven, for hvem, og hva skulle den løse. Tomme linjer blir avsnitt.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Hero-bildet øverst på prosjektsiden. Vises bredt, i 9:5 — så motivet bør " +
          "tåle å bli beskåret i høyden. I Katalog: gjerne hele serien samlet i ett bilde.",
      },
    },
    {
      name: "cardImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Bildet på prosjektoversikten. Vises kvadratisk, så et bredt hero-bilde " +
          "mister mye her. Lar du feltet stå tomt, brukes hero-bildet beskåret.",
      },
    },

    // --- Faktatabell ---
    // Rendres i denne rekkefølgen, og bare radene som har innhold.
    { name: "category", type: "text", required: true },
    { name: "year", type: "text", required: true },
    {
      name: "subject",
      type: "text",
      admin: { description: "Vises som «Emne». F.eks. «Industridesign»." },
    },
    {
      name: "duration",
      type: "text",
      admin: { description: "F.eks. «14 dager» eller «6 uker»." },
    },
    {
      name: "tools",
      type: "text",
      admin: { description: "Kommaseparert, f.eks. «Figma, Illustrator»." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lavere tall kommer først i prosjektoversikten.",
      },
    },

    // --- Tekstblokker: kun i Bildeledet ---
    {
      name: "challenge",
      type: "group",
      admin: { condition: isBildeledet },
      fields: [
        { name: "heading", type: "text", defaultValue: "Utfordringen" },
        {
          name: "body",
          type: "textarea",
          admin: { description: "Tomme linjer blir avsnitt." },
        },
      ],
    },
    {
      name: "process",
      type: "group",
      admin: { condition: isBildeledet },
      fields: [
        { name: "heading", type: "text", defaultValue: "Prosessen" },
        {
          name: "body",
          type: "textarea",
          admin: { description: "Tomme linjer blir avsnitt." },
        },
      ],
    },

    // --- Argumentet ---
    // Ett sammenhengende resonnement: hvorfor denne vinkelen, hva strategien ble,
    // hvordan merket endret seg, og hva det ble til slutt.
    {
      name: "angle",
      type: "textarea",
      admin: {
        // Både Argumentet og Systemet åpner med en vinkling under faktatabellen.
        condition: (data: { layout?: string }) => isArgumentet(data) || isSystemet(data),
        description:
          "Vises som «Vinkling», rett under faktatabellen. Her står lesningen som " +
          "skiller prosjektet fra briefen — hva du så som andre ikke så.",
      },
    },
    {
      name: "strategy",
      type: "array",
      labels: { singular: "Punkt", plural: "Strategipunkter" },
      maxRows: 4,
      admin: {
        condition: isArgumentet,
        description:
          "Vises som «Strategien», i én rad. Fire punkter fyller raden pent; " +
          "færre blir bredere, flere brekker til neste linje.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: { description: "F.eks. «Posisjon», «Forbruker», «Uttrykk», «Prinsipp»." },
        },
        { name: "value", type: "text", required: true },
      ],
    },
    {
      name: "logo",
      type: "group",
      label: "Logoutvikling",
      admin: { condition: isArgumentet },
      fields: [
        {
          name: "before",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Det gamle merket. Legg de to logofilene på samme lerret med samme " +
              "grunnlinje og kapitélhøyde — da står ordmerkene på linje av seg selv.",
          },
        },
        { name: "beforeNote", type: "text", admin: { description: "Bildetekst under «Før»." } },
        { name: "after", type: "upload", relationTo: "media" },
        { name: "afterNote", type: "text", admin: { description: "Bildetekst under «Etter»." } },
      ],
    },
    {
      name: "carrier",
      type: "group",
      label: "Bærende element",
      admin: { condition: isArgumentet },
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Bærende element",
        },
        {
          name: "lead",
          type: "textarea",
          admin: { description: "Én setning om hva grepet er. Tomme linjer blir avsnitt." },
        },
        {
          name: "items",
          type: "array",
          labels: { singular: "Variant", plural: "Varianter" },
          admin: {
            description:
              "Vises i én rad med bildetekst under. Beskjær filene til samme " +
              "høyde og bredde før opplasting — ulike mål synes med én gang på rad.",
          },
          fields: [
            { name: "image", type: "upload", relationTo: "media", required: true },
            { name: "label", type: "text" },
          ],
        },
      ],
    },
    {
      name: "designNote",
      type: "textarea",
      admin: {
        condition: isArgumentet,
        description:
          "Står mellom bildene av det endelige designet og spesialutgavene. " +
          "Her forklarer du designet nærmere. Tomme linjer blir avsnitt.",
      },
    },
    {
      name: "special",
      type: "group",
      label: "Videre forslag",
      admin: { condition: isArgumentet },
      fields: [
        { name: "heading", type: "text", defaultValue: "Designforslag til spesial-is" },
        {
          name: "images",
          type: "array",
          labels: { singular: "Bilde", plural: "Bilder" },
          admin: {
            description:
              "Samme oppsett som det endelige designet: bildene går kant i kant " +
              "over hele bredden. Tre stykker fyller raden.",
          },
          fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
        },
      ],
    },

    {
      name: "galleryHeading",
      type: "text",
      admin: {
        condition: isBildeledet,
        description:
          "Overskrift over den siste bilderaden, f.eks. «Render i Blender». " +
          "De seks første bildene går i to rader på tre; alt fra det sjuende og " +
          "utover havner under denne overskriften, i et bredere format. La feltet " +
          "stå tomt hvis raden ikke trenger en tittel.",
      },
    },

    // --- Bilder ---
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Bilde", plural: "Bilder" },
      admin: {
        description:
          "I Katalog er dette hele serien, i rekkefølge, nummerert 001 og oppover. " +
          "I Bildeledet går de tre første etter «Utfordringen», de tre neste etter " +
          "«Prosessen», og resten under overskriften over. " +
          "I Argumentet er dette «Endelig design» — de går kant i kant over hele bredden. " +
          "I Systemet er de to første skjermbildene av siden selv: desktop først, så telefon.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "label",
          type: "text",
          admin: {
            condition: isKatalog,
            description: "Materiale eller kort merkelapp, f.eks. «Eik».",
          },
        },
      ],
    },

    // --- Avslutning ---
    {
      name: "reflection",
      type: "textarea",
      admin: {
        description:
          "Vises under «Hva jeg lærte». Vær konkret — dette er ofte avsnittet som gjør " +
          "størst inntrykk. Tomme linjer blir avsnitt.",
      },
    },
  ],
};
