import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    // Webpack 캐싱 비활성화
    config.cache = false

    return config
  },
}

export default nextConfig
