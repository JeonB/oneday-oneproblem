// Common types for the application

// Database types
export interface UserData {
  _id?: string
  email: string
  name?: string
  password?: string
  profileImage?: string | null
  streak?: number
  totalProblemsSolved?: number
  lastSolvedDate?: Date
}

export interface ProblemData {
  _id?: string
  userId?: string
  title: string
  topic: string
  difficulty: string
  content: string
  contentHash: string
  userSolution?: string
  createdAt?: Date
}

export interface AlgorithmData {
  _id?: string
  name: string
  topic: string
  img?: string
}

// API types
export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Code execution types
export interface TestCase {
  input: unknown[]
  output: unknown
}

export interface ExecutionResult {
  input: unknown[]
  output: unknown
  result: unknown
  passed: boolean
  logs: string[]
  error?: string
}

export interface CodeExecutionRequest {
  problemData: {
    userSolution: string
    inputOutput: AiGeneratedContent[]
  }
}

export interface AiGeneratedContent {
  input: string | string[]
  output?: string | string[]
}

// Performance monitoring types
export interface PerformanceMetric {
  operation: string
  duration: number
  success: boolean
  error?: string
  userId?: string
  clientId?: string
  metadata?: Record<string, unknown>
  timestamp: number
}

export interface PerformanceStats {
  operation: string
  count: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  p95Duration: number
  p99Duration: number
  errorRate: number
  lastUpdated: number
}

export interface HealthStatus {
  healthy: boolean
  warnings: string[]
  critical: string[]
  summary: {
    totalOperations: number
    avgResponseTime: number
    errorRate: number
    slowOperations: number
  }
}

// Form types
export interface SignUpFormData {
  email: string
  password: string
  name: string
  profileImage?: File
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ProfileFormData {
  username: string
  password: string
  profileImage?: File
}

// UI types
export interface FeedbackState {
  feedback: string
  isLoading: boolean
  error?: string
}

export interface TestResult {
  input: unknown[]
  output: unknown
  result: unknown
  passed: boolean
  logs: string[]
  error?: string
}

// Rate limiting types
export interface RateLimitResult {
  allowed: boolean
  retryAfter: number
  remaining: number
}

// Logger types
export interface LogContext {
  requestId?: string
  userId?: string
  clientId?: string
  operation?: string
  [key: string]: unknown
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  MONGODB_URI: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  GITHUB_ID?: string
  GITHUB_SECRET?: string
  ENABLE_PERFORMANCE_MONITORING?: string
  PERFORMANCE_FLUSH_INTERVAL?: string
  PERFORMANCE_SLOW_OPERATION_THRESHOLD?: string
  RATE_LIMIT_WINDOW_MS?: string
  RATE_LIMIT_MAX_REQUESTS?: string
  ENABLE_WEB_WORKERS?: string
  ENABLE_RATE_LIMITING?: string
  ENABLE_STRUCTURED_LOGGING?: string
  LOG_LEVEL?: string
  LOG_FORMAT?: string
  ENABLE_CACHING?: string
  CACHE_MAX_AGE?: string
}
