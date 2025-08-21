import { vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string
    nextUrl: { searchParams: URLSearchParams }
    headers: { get: any }
    json: any

    constructor(url: string = 'http://localhost:3000') {
      this.url = url
      this.nextUrl = {
        searchParams: new URLSearchParams(),
      }
      this.headers = {
        get: vi.fn(),
      }
      this.json = vi.fn()
    }
  },
  NextResponse: {
    json: vi.fn((data: any, options: any) => ({ data, ...options })),
  },
}))

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  compare: vi.fn().mockResolvedValue(true),
}))

// Mock fs promises
vi.mock('fs/promises', () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}))

// Mock path
vi.mock('path', () => ({
  join: vi.fn((...args) => args.join('/')),
}))

// Global test setup
beforeEach(() => {
  vi.clearAllMocks()
})

// Setup testing library
import '@testing-library/jest-dom'
