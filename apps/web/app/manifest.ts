import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KidSafe YouTube',
    short_name: 'KidSafe',
    description: 'Safe, AI-filtered YouTube content for kids',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCF9',
    theme_color: '#6C63FF',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
