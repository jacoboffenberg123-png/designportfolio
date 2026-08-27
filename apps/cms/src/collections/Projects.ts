import type { CollectionConfig } from "payload";

/** Which page template renders this project. */
const LAYOUTS = [
  { label: "Bildeledet — store bilder, lite tekst", value: "bildeledet" },
  { label: "Katalog — en serie objekter, nummerert", value: "katalog" },
] as const;

const isKatalog = (data: { layout?: string }) => data?.layout === "katalog";
const isBildeledet = (data: { layout?: string }) => data?.layout !== "katalog";

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
        description: "Hero-bildet. I Katalog: gjerne hele serien samlet i ett bilde.",
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

    // --- Bilder ---
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Bilde", plural: "Bilder" },
      admin: {
        description:
          "I Katalog er dette hele serien, i rekkefølge, nummerert 001 og oppover. " +
          "I Bildeledet går de to første side om side, resten i tre kolonner under.",
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
