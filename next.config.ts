import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    domains: ['example.com', 'cdn.example.com'], // 외부 이미지 도메인
  },
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
  devIndicators: {
    appIsrStatus: false,
  },
}

export default nextConfig
