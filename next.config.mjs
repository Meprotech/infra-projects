/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep local development assets separate from Vercel's required `.next`
  // production output so `next build` cannot break a running dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
