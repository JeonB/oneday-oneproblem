import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import User, { UserProps } from '@/app/lib/models/User'
import Problem from '@/app/lib/models/Problem'
import dayjs from 'dayjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import crypto from 'crypto'
import { getClientIdFromRequest, rateLimit } from '@/app/lib/rateLimit'
import { z } from 'zod'
import { logger, createRequestContext } from '@/lib/logger'

// 유저 정보 업데이트 함수
async function updateUserStats(
  email: string,
  today: Date,
): Promise<{ streak: number; totalProblemsSolved: number }> {
  const userStats = (await User.findOne({ email })) as UserProps | null

  if (!userStats) {
    throw new Error('사용자를 찾을 수 없습니다.')
  }

  const isYesterday = dayjs(userStats.lastSolvedDate).isSame(
    dayjs().subtract(1, 'day'),
    'day',
  )

  const newStreak = isYesterday ? userStats.streak + 1 : 1

  await User.updateOne(
    { email },
    {
      $set: {
        lastSolvedDate: today,
        streak: newStreak,
      },
      $inc: { totalProblemsSolved: 1 },
    },
  )

  return {
    streak: newStreak,
    totalProblemsSolved: userStats.totalProblemsSolved + 1,
  }
}

// 문제 풀이 상태 업데이트 함수
async function handleProblemUpdate(
  title: string,
  userId: string,
  content: string,
  userSolution: string,
  topic: string,
  difficulty: string,
): Promise<void> {
  const contentHash = crypto
    .createHash('sha256')
    .update(content, 'utf8')
    .digest('hex')

  const existingProblem = await Problem.findOne({ userId, contentHash })

  if (existingProblem) {
    // 기존 문제 업데이트
    await existingProblem.updateOne({
      $set: { userSolution },
    })
  } else {
    // 새 문제 생성
    const newProblem = new Problem({
      title,
      userId,
      topic,
      difficulty,
      content,
      contentHash,
      userSolution,
    })
    await newProblem.save()
  }
}

// POST: 문제 풀이 처리 및 유저 업데이트
export async function POST(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Problem solved submission received', context)

  try {
    const id = getClientIdFromRequest(req)
    const rl = rateLimit({ id, capacity: 20, refillPerSec: 5 })
    if (!rl.allowed) {
      logger.warn('Rate limit exceeded for problem solved submission', {
        ...context,
        clientId: id,
      })
      return NextResponse.json(
        { message: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }
    await connectDB()
    const BodySchema = z.object({
      title: z.string().min(1),
      userId: z.string().min(1),
      topic: z.string().min(1),
      difficulty: z.string().min(1),
      content: z.string().min(1),
      userSolution: z.string().min(1),
      email: z.string().email(),
    })

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      logger.warn('Invalid problem solved payload', context)
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    const { title, userId, topic, difficulty, content, userSolution, email } =
      parsed.data

    const session = await getServerSession(authOptions)
    if (
      !session ||
      session.user?.id !== userId ||
      session.user?.email !== email
    ) {
      logger.warn('Unauthorized problem solved submission', {
        ...context,
        userId,
        email,
      })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const today = dayjs().startOf('day').toDate()

    const userStats = await User.findOne({ email })
    if (!userStats) {
      logger.error(
        'User not found during problem solved submission',
        undefined,
        {
          ...context,
          email,
        },
      )
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    // 문제 풀이 업데이트
    await handleProblemUpdate(
      title,
      userId,
      content,
      userSolution,
      topic,
      difficulty,
    )

    // 유저 정보 업데이트
    const updatedStats = await updateUserStats(email, today)

    logger.info('Problem solved successfully', {
      ...context,
      userId,
      topic,
      difficulty,
      newStreak: updatedStats.streak,
      totalProblems: updatedStats.totalProblemsSolved,
    })

    return NextResponse.json(updatedStats)
  } catch (error) {
    logger.error(
      'Error processing problem solved submission',
      error as Error,
      context,
    )
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}

const GetQuerySchema = z.object({
  userId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .enum(['createdAt', '-createdAt', 'title', '-title'])
    .default('-createdAt'),
})

// GET: 유저의 문제 목록 가져오기
export async function GET(req: NextRequest) {
  const context = createRequestContext(req)
  logger.info('Problem list request received', context)

  try {
    await connectDB()

    const { searchParams } = req.nextUrl
    const parsed = GetQuerySchema.safeParse({
      userId: searchParams.get('userId'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    })

    if (!parsed.success) {
      logger.warn('Invalid query parameters for problem list', context)
      return NextResponse.json(
        { message: 'Invalid query parameters' },
        { status: 400 },
      )
    }

    const { userId, page, limit, sort } = parsed.data

    const session = await getServerSession(authOptions)
    if (!session || session.user?.id !== userId) {
      logger.warn('Unauthorized problem list request', { ...context, userId })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const skip = (page - 1) * limit
    const sortObj = sort.startsWith('-')
      ? { [sort.slice(1)]: -1 as const }
      : { [sort]: 1 as const }

    const [problems, total] = await Promise.all([
      Problem.find({ userId }).sort(sortObj).skip(skip).limit(limit).lean(),
      Problem.countDocuments({ userId }),
    ])

    const totalPages = Math.ceil(total / limit)

    logger.info('Problem list retrieved successfully', {
      ...context,
      userId,
      problemsCount: problems.length,
      total,
      page,
      totalPages,
    })

    return NextResponse.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    logger.error('Error retrieving problem list', error as Error, context)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}
