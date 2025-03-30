import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/alex-paden-site',
  assetPrefix: '/alex-paden-site/',
};

export default nextConfig; 