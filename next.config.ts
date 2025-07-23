/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // This will match i.scdn.co, mosaic.scdn.co, and any other *.scdn.co
        hostname: '**.scdn.co',
      },
      {
        protocol: 'https',
        // This will match image-cdn-ak.spotifycdn.com and any other *.spotifycdn.com
        hostname: '**.spotifycdn.com',
      },
    ],
  },
};

module.exports = nextConfig;