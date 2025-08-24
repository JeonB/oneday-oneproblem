import { z } from 'zod'

// Environment variables schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  ENABLE_PERFORMANCE_MONITORING: z.string().optional(),
  PERFORMANCE_FLUSH_INTERVAL: z.string().optional(),
  PERFORMANCE_SLOW_OPERATION_THRESHOLD: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
  ENABLE_WEB_WORKERS: z.string().optional(),
  ENABLE_RATE_LIMITING: z.string().optional(),
  ENABLE_STRUCTURED_LOGGING: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  LOG_FORMAT: z.string().optional(),
  ENABLE_CACHING: z.string().optional(),
  CACHE_MAX_AGE: z.string().optional(),
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    process.exit(1)
  }
}

// Export validated environment variables
export const env = validateEnv()

// Helper functions for environment checks
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flags
export const features = {
  performanceMonitoring: env.ENABLE_PERFORMANCE_MONITORING === 'true',
  webWorkers: env.ENABLE_WEB_WORKERS === 'true',
  rateLimiting: env.ENABLE_RATE_LIMITING === 'true',
  structuredLogging: env.ENABLE_STRUCTURED_LOGGING === 'true',
  caching: env.ENABLE_CACHING === 'true',
} as const

// Configuration helpers
export const config = {
  performance: {
    flushInterval: parseInt(env.PERFORMANCE_FLUSH_INTERVAL || '60000'),
    slowOperationThreshold: parseInt(
      env.PERFORMANCE_SLOW_OPERATION_THRESHOLD || '1000',
    ),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  logging: {
    level: env.LOG_LEVEL || 'info',
    format: env.LOG_FORMAT || 'json',
  },
  cache: {
    maxAge: parseInt(env.CACHE_MAX_AGE || '3600'),
  },
} as const
