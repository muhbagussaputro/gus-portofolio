import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // ppr: true, // PPR hanya tersedia di versi canary Next.js
    optimisticClientCache: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
