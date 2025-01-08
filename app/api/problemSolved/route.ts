import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/connecter'
import User, { UserProps } from '@/app/lib/models/User'
import dayjs from 'dayjs'
import Problem from '@/app/lib/models/Problem'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { userId, topic, difficulty, content, userSolution, email } =
      await req.json()

    const newProblem = new Problem({
      userId,
      topic,
      difficulty,
      content,
      userSolution,
    })
    await newProblem.save()

    // 요청 데이터 가져오기
    const userStats = (await User.findOne({ email })) as UserProps | null

    if (!userStats) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    const today = dayjs().startOf('day').toISOString()

    if (userStats.lastSolvedDate === today) {
      // 오늘 이미 문제를 푼 경우
      return NextResponse.json({
        streak: userStats.streak,
        totalProblemsSolved: userStats.totalProblemsSolved,
      })
    }

    // 자정을 넘긴 경우
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

    return NextResponse.json({
      streak: newStreak,
      totalProblemsSolved: userStats.totalProblemsSolved + 1,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}

//topic, difficulty, content, userSolution 를 반환하는 API
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { userId } = await req.json()

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
