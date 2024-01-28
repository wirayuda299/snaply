/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        pathname: "/**/*",
        protocol: "https",
        port: "",
      },
      {
        hostname: "img.clerk.com",
        pathname: "/*",
        protocol: "https",
        port: "",
      },
    ],
  },
  env: {
    EDITOR_API_KEY: process.env.EDITOR_API_KEY,
    SERVER_URL: process.env.SERVER_URL,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
