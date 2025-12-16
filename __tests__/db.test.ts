import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest'
import { userQueries, problemQueries, algorithmQueries } from '@/lib/db'
import { withPerformanceMonitoring } from '@/lib/db'

// Mock the database connection and models
vi.mock('@/app/lib/connecter', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/app/lib/models/User', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    updateOne: vi.fn(),
  },
}))

vi.mock('@/app/lib/models/Problem', () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

vi.mock('@/app/lib/models/Algorithms', () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    updateOne: vi.fn(),
    deleteMany: vi.fn(),
    insertMany: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('Database Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('userQueries', () => {
    it('should find user by email with minimal fields', async () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' }
      const User = (await import('@/app/lib/models/User')).default
      ;(User.findOne as MockedFunction<typeof User.findOne>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockUser),
        }),
      } as any)

      const result = await userQueries.findByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    })

    it('should create new user', async () => {
      const mockUserData = { name: 'Test User', email: 'test@example.com' }
      const User = (await import('@/app/lib/models/User')).default
      ;(User.create as any).mockResolvedValue(mockUserData)

      const result = await userQueries.createUser(mockUserData)

      expect(result).toEqual(mockUserData)
      expect(User.create).toHaveBeenCalledWith(mockUserData)
    })

    it('should update user profile', async () => {
      const mockUser = { name: 'Updated User', email: 'test@example.com' }
      const User = (await import('@/app/lib/models/User')).default
      ;(
        User.findOneAndUpdate as MockedFunction<typeof User.findOneAndUpdate>
      ).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as any)

      const result = await userQueries.updateUser('test@example.com', {
        name: 'Updated User',
      })

      expect(result).toEqual(mockUser)
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        { $set: { name: 'Updated User' } },
        { new: true },
      )
    })
  })

  describe('problemQueries', () => {
    it('should find problems by user ID with pagination', async () => {
      const mockProblems = [{ title: 'Problem 1' }, { title: 'Problem 2' }]
      const mockTotal = 2
      const Problem = (await import('@/app/lib/models/Problem')).default

      ;(Problem.find as MockedFunction<typeof Problem.find>).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              lean: vi.fn().mockResolvedValue(mockProblems),
            }),
          }),
        }),
      } as any)
      ;(
        Problem.countDocuments as MockedFunction<typeof Problem.countDocuments>
      ).mockResolvedValue(mockTotal)

      const result = await problemQueries.findByUserId('user123', {
        page: 1,
        limit: 10,
        sort: '-createdAt',
      })

      expect(result).toEqual({ problems: mockProblems, total: mockTotal })
    })

    it('should find problem by content hash', async () => {
      const mockProblem = { title: 'Test Problem', contentHash: 'hash123' }
      const Problem = (await import('@/app/lib/models/Problem')).default
      ;(
        Problem.findOne as MockedFunction<typeof Problem.findOne>
      ).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProblem),
      } as any)

      const result = await problemQueries.findByContentHash(
        'user123',
        'hash123',
      )

      expect(result).toEqual(mockProblem)
      expect(Problem.findOne).toHaveBeenCalledWith({
        userId: 'user123',
        contentHash: 'hash123',
      })
    })
  })

  describe('algorithmQueries', () => {
    it('should find all algorithms', async () => {
      const mockAlgorithms = [{ name: 'Algo 1' }, { name: 'Algo 2' }]
      const Algorithms = (await import('@/app/lib/models/Algorithms')).default
      ;(
        Algorithms.find as MockedFunction<typeof Algorithms.find>
      ).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockAlgorithms),
        }),
      } as any)

      const result = await algorithmQueries.findAll()

      expect(result).toEqual(mockAlgorithms)
      expect(Algorithms.find).toHaveBeenCalledWith({})
    })

    it('should handle bulk insert with duplicates gracefully', async () => {
      const mockAlgorithms = [
        { name: 'Algo 1', topic: 'test' },
        { name: 'Algo 2', topic: 'test' },
      ]
      const Algorithms = (await import('@/app/lib/models/Algorithms')).default

      // Mock duplicate key error
      const duplicateError = {
        writeErrors: [{ code: 11000 }, { code: 11000 }],
      }
      ;(Algorithms.insertMany as any).mockRejectedValue(duplicateError)

      const result = await algorithmQueries.bulkInsert(mockAlgorithms)

      expect(result).toEqual(mockAlgorithms)
      expect(Algorithms.insertMany).toHaveBeenCalledWith(mockAlgorithms, {
        ordered: false,
      })
    })
  })

  describe('withPerformanceMonitoring', () => {
    it('should monitor operation performance', async () => {
      const mockOperation = vi.fn().mockResolvedValue('test result')
      const logger = (await import('@/lib/logger')).logger

      const result = await withPerformanceMonitoring(
        'testOperation',
        mockOperation,
      )

      expect(result).toBe('test result')
      expect(mockOperation).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith(
        'Database operation completed',
        expect.objectContaining({
          operation: 'testOperation',
          duration: expect.any(Number),
        }),
      )
    })

    it('should handle operation errors', async () => {
      const mockError = new Error('Test error')
      const mockOperation = vi.fn().mockRejectedValue(mockError)
      const logger = (await import('@/lib/logger')).logger

      await expect(
        withPerformanceMonitoring('testOperation', mockOperation),
      ).rejects.toThrow('Test error')
      expect(logger.error).toHaveBeenCalledWith(
        'Database operation failed',
        mockError,
        expect.objectContaining({
          operation: 'testOperation',
          duration: expect.any(Number),
        }),
      )
    })
  })
})
