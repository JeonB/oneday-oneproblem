import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  devIndicators: false,
  // Windows에서 symlink 권한 문제를 피하기 위해 standalone 출력은 프로덕션 환경에서만 활성화
  ...(process.env.NODE_ENV === 'production' && process.platform !== 'win32'
    ? { output: 'standalone' }
    : {}),
}

export default nextConfig
