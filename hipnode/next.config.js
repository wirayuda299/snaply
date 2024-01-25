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
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    EDITOR_API_KEY: process.env.EDITOR_API_KEY,
    SERVER_URL: process.env.SERVER_URL,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
