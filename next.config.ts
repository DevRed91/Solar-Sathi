import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.solarsquare.in',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
