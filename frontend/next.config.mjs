/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // ✅ Added: Strapi Cloud (production image hosting)
      {
        protocol: "https",
        hostname: "leading-sparkle-685c49a4449.strapiapp.com",
      },
      // ✅ Added: Strapi Cloud media uploads subdomain
      {
        protocol: "https",
        hostname: "*.strapiapp.com",
      },
      // ✅ Added: Clerk user profile images
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
