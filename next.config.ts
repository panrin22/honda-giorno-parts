import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Recommended for VPS and some managed Node.js hosting
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
