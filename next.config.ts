import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      "www.facebook.com"
    ],
    formats: ['image/avif', 'image/webp'],
   unoptimized: false,
   qualities: [25, 50, 70, 75, 80, 90 ,100],
  },
  // Old easyfloors.ae URLs whose CMS rows are DRAFT here, so the domain-level
  // redirect lands on a 404. Each maps to its nearest live parent — never the
  // homepage. Dead single-segment categories (/woodvail) stay on the proxy's
  // 410 policy; these cover the deeper paths the proxy doesn't handle.
  // Verified against the full CMS URL set on 27 Aug 2026.
  async redirects() {
    return [
      {
        source: '/accessories/skirting-10cm',
        destination: '/accessories',
        permanent: true
      },
      {
        source: '/accessories/skirting-12cm',
        destination: '/accessories',
        permanent: true
      },
      // :path* also matches the bare /richmond/spc-stone subcategory page
      {
        source: '/richmond/spc-stone/:path*',
        destination: '/richmond',
        permanent: true
      },
      {
        source: '/polar/spc-herringbone/allegra-vance',
        destination: '/polar/spc-herringbone',
        permanent: true
      },
      // :path+ (one or more segments) leaves /woodvail itself on the 410
      {
        source: '/woodvail/:path+',
        destination: '/collections',
        permanent: true
      }
    ];
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
