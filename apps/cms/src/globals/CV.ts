import type { GlobalConfig } from "payload";

export const CV: GlobalConfig = {
  slug: "cv",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
      required: true,
    },
    {
      name: "education",
      type: "array",
      fields: [
        { name: "program", type: "text", required: true },
        { name: "school", type: "text", required: true },
        { name: "dates", type: "text", required: true },
      ],
    },
    {
      name: "skills",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "contactEmail",
      type: "email",
    },
    {
      name: "linkedin",
      type: "text",
    },
    {
      name: "instagram",
      type: "text",
    },
  ],
};
