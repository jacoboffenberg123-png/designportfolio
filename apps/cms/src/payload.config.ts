import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { CV } from "./globals/CV";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects],
  globals: [CV],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Schema sync is a local-only act. Dev and production share one Neon
    // database, so a deploy that pushed would drop whatever columns the current
    // build no longer declares — and it would do it on live data, unattended.
    //
    // Adding a field: run this locally once with PAYLOAD_DB_PUSH=true, check the
    // column landed, then deploy. Set it to "false" to boot against Neon without
    // touching the schema at all.
    push:
      process.env.PAYLOAD_DB_PUSH === "true"
        ? true
        : process.env.PAYLOAD_DB_PUSH === "false"
          ? false
          : process.env.NODE_ENV !== "production",
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  cors: [process.env.WEB_APP_URL || "http://localhost:3001"],
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${process.env.R2_PUBLIC_URL}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
});
