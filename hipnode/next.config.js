/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'hipnode-bucket.s3.amazonaws.com',
        pathname: '/*',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'img.clerk.com',
        pathname: '/*',
        protocol: 'https',
        port: ''
      },
    ]
  },
  env: {
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    EDITOR_API_KEY: process.env.EDITOR_API_KEY
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
