/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VERCEL_URL: process.env.VERCEL_URL,
  }
}

module.exports = nextConfig
