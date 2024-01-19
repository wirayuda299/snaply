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
  compress: true
}

module.exports = nextConfig
