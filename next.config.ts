import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
