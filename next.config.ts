import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      "www.facebook.com"
    ],
    formats: ['image/avif', 'image/webp'],
   unoptimized: false
  },
async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },
      {
        source: '/:path*\\.(avif|webp|png|jpg|jpeg|svg|gif)',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
