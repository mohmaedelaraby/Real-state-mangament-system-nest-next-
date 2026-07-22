const fs = require('node:fs');
const path = require('node:path');

// antd's compiled output places "use strict" before "use client", which stops Next.js
// from recognizing the client boundary for antd/rc-* packages. Transpiling them through
// Next's own compiler fixes the directive detection.
const nodeModulesDir = path.join(__dirname, 'node_modules');
const rcPackages = fs
  .readdirSync(nodeModulesDir)
  .filter((name) => name.startsWith('rc-'));
const rcComponentScope = fs.existsSync(path.join(nodeModulesDir, '@rc-component'))
  ? fs
      .readdirSync(path.join(nodeModulesDir, '@rc-component'))
      .map((name) => `@rc-component/${name}`)
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/icons-svg', ...rcPackages, ...rcComponentScope],
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
};

module.exports = nextConfig;
