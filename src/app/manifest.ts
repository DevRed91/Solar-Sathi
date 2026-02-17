import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Solar Square',
    short_name: 'Solar',
    description:
      'Generate solar power for housing societies with convenience at affordable rates with Solarsquare. Explore end-to-end service, from installation to maintenance &amp; more!',
    start_url: '/',
    display: 'standalone',
    background_color: '#2EC6FE',
    theme_color: '#8936FF',
    orientation: 'any',
    lang: 'en-GB',
    dir: 'auto',
    icons: [
      {
        src: '/images/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
