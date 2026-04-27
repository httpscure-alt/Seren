import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.68.109"],
  // Keep deploy tracing rooted at `web/` when a lockfile exists outside this folder.
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      { source: "/email-mockups", destination: "/emails", permanent: false },
      { source: "/mockups/emails", destination: "/emails", permanent: false },
      { source: "/demos/email-mockups", destination: "/emails", permanent: false },
    ];
  },
  // Do NOT set `turbopack.root` here: when it equals the app dir, CSS `@import "tailwindcss"`
  // can resolve from the parent folder and fail with "Can't resolve 'tailwindcss' in '.../Seren'".
  // See: https://github.com/vercel/next.js/issues/90307
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    // Force-disable caching for local demos (iOS Safari is aggressive).
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
