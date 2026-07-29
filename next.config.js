const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Booking OTP toggle: `NEXT_DISABLE_OTP` in .env is exposed to the browser
  // as `process.env.DISABLE_OTP` (no NEXT_PUBLIC_ prefix needed).
  // Inlined at build time — changing it requires a rebuild.
  env: {
    DISABLE_OTP: process.env.NEXT_DISABLE_OTP ?? "false",
  },
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
