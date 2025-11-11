/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // App Router 사용 시
  },
};

module.exports = nextConfig;
