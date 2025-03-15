import { generateProblem } from '@/app/lib/generateProblem'
import ProblemDisplay from '@/components/ui/problem/ProblemDisplay'
import { unstable_cache } from 'next/cache'

const getCachedProblem = unstable_cache(
  async (topic: string, difficulty: string) => {
    try {
      return await generateProblem(topic, difficulty)
    } catch (err) {
      console.error('Error fetching problem:', err)
      return ''
    }
  },
  ['problem'],
  { revalidate: 300 },
)

const ProblemPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ topic: string }>
  searchParams: Promise<{ difficulty: string }>
}) => {
  const { topic } = await params
  const { difficulty } = await searchParams

  const generatedProblem = await getCachedProblem(topic, difficulty)
  if (generatedProblem instanceof Error) {
    throw generatedProblem
  }

  return <ProblemDisplay initialContent={generatedProblem} />
}

export default ProblemPage
