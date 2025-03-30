import type { NextConfig } from "next";

// Simplest possible config to avoid any overhead
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for local development
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
