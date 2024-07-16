/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "export-download.canva.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
