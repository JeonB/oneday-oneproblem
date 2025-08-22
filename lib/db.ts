import { connectDB } from '@/app/lib/connecter'
import User from '@/app/lib/models/User'
import Problem from '@/app/lib/models/Problem'
import Algorithms from '@/app/lib/models/Algorithms'
import { logger } from './logger'
import { withEnhancedPerformanceMonitoring } from './performance'

// Database connection wrapper with error handling
export async function withDB<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDB()
    return await operation()
  } catch (error) {
    logger.error('Database operation failed', error as Error)
    throw error
  }
}

// Optimized user queries
export const userQueries = {
  // Get user by email with minimal fields
  async findByEmail(email: string) {
    return withDB(() =>
      User.findOne({ email })
        .select(
          'name email profileImage streak totalProblemsSolved lastSolvedDate',
        )
        .lean(),
    )
  },

  // Get user by email with all fields (for auth)
  async findByEmailWithPassword(email: string) {
    return withDB(() => User.findOne({ email }).lean())
  },

  // Create new user
  async createUser(userData: any) {
    return withDB(() => User.create(userData))
  },

  // Update user profile
  async updateUser(email: string, updates: any) {
    return withDB(() =>
      User.findOneAndUpdate({ email }, { $set: updates }, { new: true }).lean(),
    )
  },

  // Update user stats efficiently
  async updateStats(email: string, updates: any) {
    return withDB(() => User.updateOne({ email }, { $set: updates }))
  },

  // Increment user stats
  async incrementStats(email: string, increments: any) {
    return withDB(() => User.updateOne({ email }, { $inc: increments }))
  },
}

// Optimized problem queries
export const problemQueries = {
  // Get problems with pagination and sorting
  async findByUserId(
    userId: string,
    options: {
      page: number
      limit: number
      sort: string
    },
  ) {
    const { page, limit, sort } = options
    const skip = (page - 1) * limit
    const sortObj = sort.startsWith('-')
      ? { [sort.slice(1)]: -1 as const }
      : { [sort]: 1 as const }

    return withDB(async () => {
      const [problems, total] = await Promise.all([
        Problem.find({ userId }).sort(sortObj).skip(skip).limit(limit).lean(),
        Problem.countDocuments({ userId }),
      ])

      return { problems, total }
    })
  },

  // Find problem by content hash
  async findByContentHash(userId: string, contentHash: string) {
    return withDB(() => Problem.findOne({ userId, contentHash }).lean())
  },

  // Create or update problem
  async upsertProblem(problemData: any) {
    return withDB(() =>
      Problem.findOneAndUpdate(
        { userId: problemData.userId, contentHash: problemData.contentHash },
        problemData,
        { upsert: true, new: true },
      ),
    )
  },
}

// Optimized algorithm queries
export const algorithmQueries = {
  // Get all algorithms with caching
  async findAll() {
    return withDB(() => Algorithms.find({}).select('name topic img').lean())
  },

  // Find algorithms by names
  async findByNames(names: string[]) {
    return withDB(() => Algorithms.find({ name: { $in: names } }).lean())
  },

  // Update algorithm by name
  async updateAlgorithm(name: string, updates: any) {
    return withDB(() => Algorithms.updateOne({ name }, { $set: updates }))
  },

  // Delete all algorithms
  async deleteAll() {
    return withDB(() => Algorithms.deleteMany({}))
  },

  // Bulk insert algorithms with duplicate handling
  async bulkInsert(algorithms: any[]) {
    return withDB(async () => {
      try {
        return await Algorithms.insertMany(algorithms, { ordered: false })
      } catch (error: any) {
        // Handle duplicate key errors gracefully
        if (error?.writeErrors?.every((we: any) => we?.code === 11000)) {
          return algorithms
        }
        throw error
      }
    })
  },
}

// Cache control utilities
export const cacheControl = {
  // Short cache for frequently changing data
  short: {
    'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
  },

  // Medium cache for semi-static data
  medium: {
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
  },

  // Long cache for static data
  long: {
    'Cache-Control': 's-maxage=86400, stale-while-revalidate=172800',
  },

  // No cache for sensitive data
  none: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
}

// Performance monitoring wrapper
export function withPerformanceMonitoring<T>(
  operationName: string,
  operation: () => Promise<T>,
): Promise<T> {
  const start = Date.now()

  return operation()
    .then(result => {
      const duration = Date.now() - start
      logger.info(`Database operation completed`, {
        operation: operationName,
        duration,
      })
      return result
    })
    .catch(error => {
      const duration = Date.now() - start
      logger.error(`Database operation failed`, error, {
        operation: operationName,
        duration,
      })
      throw error
    })
}
