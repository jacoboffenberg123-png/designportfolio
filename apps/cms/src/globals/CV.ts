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
        {
          name: "note",
          type: "text",
          admin: {
            description:
              "Én linje om innholdet, f.eks. «20 ukers grunnforløp med eksamen». " +
              "Står under skole og årstall. La feltet stå tomt for å utelate linjen.",
          },
        },
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
