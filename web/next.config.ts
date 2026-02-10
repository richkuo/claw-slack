import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['react-markdown'],
  },
  reactStrictMode: true,
};

export default nextConfig;