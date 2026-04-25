import type { NextConfig } from "next";

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
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
