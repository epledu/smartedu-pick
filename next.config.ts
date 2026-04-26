import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Google profile images
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Kakao profile images
      { protocol: "http", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
      // Naver profile images
      { protocol: "https", hostname: "phinf.pstatic.net" },
      { protocol: "https", hostname: "ssl.pstatic.net" },
    ],
  },
  compress: true,
  // Pin Turbopack to this project so it stops inferring an unrelated
  // pnpm-lock.yaml in the user's home dir as the workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    optimizeCss: true,
  },
};

// PWA note: @ducanh2912/next-pwa relies on a webpack plugin that doesn't run
// under Next.js 16's default Turbopack build. Wrapping the config with it
// silently no-ops — the build "succeeds" but no service worker is emitted.
// Until next-pwa ships a Turbopack-compatible build, ship without a SW and
// rely on the manifest + add-to-home-screen prompt for installability.
export default nextConfig;
