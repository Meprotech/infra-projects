/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // three.js / r3f ship ESM that Next transpiles automatically; this keeps
  // tree-shaking friendly without extra config.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
