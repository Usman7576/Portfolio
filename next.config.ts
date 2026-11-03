import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Room for a 4 MB resume PDF (see lib/resume-file.ts); Vercel's own limit is 4.5 MB.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  images: {
    // Project and post images uploaded from the admin dashboard.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
