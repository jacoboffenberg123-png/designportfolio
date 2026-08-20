import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "order"],
  },
  fields: [
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
        description: "Used in the URL: /arbeid/[slug]",
      },
    },
    {
      name: "category",
      type: "text",
      required: true,
    },
    {
      name: "year",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "tools",
      type: "text",
      admin: {
        description: "Comma-separated, e.g. \"Figma, Next.js\"",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first in the overview grid.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "challenge",
      type: "group",
      fields: [
        { name: "heading", type: "text", defaultValue: "Utfordringen" },
        { name: "body", type: "textarea" },
      ],
    },
    {
      name: "process",
      type: "group",
      fields: [
        { name: "heading", type: "text", defaultValue: "Prosessen" },
        { name: "body", type: "textarea" },
      ],
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
