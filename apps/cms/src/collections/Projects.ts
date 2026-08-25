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
          "To–tre setninger: hva var oppgaven, for hvem, og hva skulle den løse.",
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
    { name: "category", type: "text", required: true },
    { name: "year", type: "text", required: true },
    {
      name: "subject",
      type: "text",
      admin: { description: "Emne eller kurs, f.eks. «Industridesign»." },
    },
    {
      name: "duration",
      type: "text",
      admin: { description: "F.eks. «14 dager» eller «6 uker»." },
    },
    {
      name: "role",
      type: "text",
      admin: { description: "«Solo», eller din rolle hvis det var gruppearbeid." },
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
        { name: "body", type: "textarea" },
      ],
    },
    {
      name: "process",
      type: "group",
      admin: { condition: isBildeledet },
      fields: [
        { name: "heading", type: "text", defaultValue: "Prosessen" },
        { name: "body", type: "textarea" },
      ],
    },

    // --- Bilder ---
    {
      name: "wideImage",
      type: "upload",
      relationTo: "media",
      admin: {
        condition: isBildeledet,
        description:
          "Stort fullbredde-bilde midt på siden, mellom Utfordringen og Prosessen. Valgfritt.",
      },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Bilde", plural: "Bilder" },
      admin: {
        description:
          "I Katalog er dette hele serien, i rekkefølge. I Bildeledet vises de i et rutenett nederst.",
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
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: {
            condition: isKatalog,
            description: "Vises forstørret i «Nærmere»-seksjonen. Velg gjerne tre.",
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
          "«Hva jeg lærte». Vær konkret — dette er ofte avsnittet som gjør størst inntrykk.",
      },
    },
  ],
};
