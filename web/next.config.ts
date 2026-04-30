import path from "node:path";
import type { NextConfig } from "next";

/** Directory containing this config + `package.json` + `node_modules/next` (`web/` on Vercel). */
const packageRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: packageRoot,
  },
  allowedDevOrigins: ["192.168.68.109"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep deploy tracing rooted at `web/` when a lockfile exists outside this folder.
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      { source: "/email-mockups", destination: "/emails", permanent: false },
      { source: "/mockups/emails", destination: "/emails", permanent: false },
      { source: "/demos/email-mockups", destination: "/emails", permanent: false },
    ];
  },
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
