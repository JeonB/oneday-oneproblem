import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  devIndicators: false,
  output: 'standalone',
}

export default nextConfig
