import type { NextConfig } from "next";

const cmsUrl = new URL(process.env.CMS_URL || "http://localhost:3002");
const isLocalCms = ["localhost", "127.0.0.1"].includes(cmsUrl.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
        hostname: cmsUrl.hostname,
        port: cmsUrl.port || undefined,
      },
    ],
    // Next.js 16 blocks image optimization from local/private IPs by default (SSRF
    // protection). Our own CMS dev server on localhost is the one legitimate case —
    // only enabled when CMS_URL actually points at localhost, never in production.
    ...(isLocalCms ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
