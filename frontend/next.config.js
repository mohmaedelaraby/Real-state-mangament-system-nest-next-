const fs = require('node:fs');
const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/icons-svg'],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/apartments',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
