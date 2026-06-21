import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow Three.js
  experimental: {},
  // Optimize
  compress: true,
  poweredByHeader: false,
  // Images
  images: { formats: ["image/webp"] },
};

export default nextConfig;
