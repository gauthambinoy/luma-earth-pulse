/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

module.exports = nextConfig;
