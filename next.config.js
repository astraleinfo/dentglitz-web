const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: new URL(cdnUrl).hostname,
      },
    ],
  },
};

module.exports = nextConfig;
