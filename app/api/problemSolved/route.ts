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
  try {
    const id = getClientIdFromRequest(req)
    const rl = rateLimit({ id, capacity: 20, refillPerSec: 5 })
    if (!rl.allowed)
      return NextResponse.json(
        { message: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
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
    if (!parsed.success)
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })

    const { title, userId, topic, difficulty, content, userSolution, email } =
      parsed.data

    const session = await getServerSession(authOptions)
    if (
      !session ||
      session.user?.id !== userId ||
      session.user?.email !== email
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const today = dayjs().startOf('day').toDate()

    const userStats = await User.findOne({ email })
    if (!userStats) {
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

    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}

// GET: 유저의 문제 목록 가져오기
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 },
      )
    }

    const session = await getServerSession(authOptions)
    if (!session || session.user?.id !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const problems = await Problem.find({ userId })

    return NextResponse.json(problems)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}
