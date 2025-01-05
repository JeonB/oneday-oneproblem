import OpenAI from 'openai'

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// 피드백 인터페이스 정의
interface Feedback {
  timeComplexity: string
  feedback: {
    efficiency: string
    readability: string
  }
  aiImprovedCode: string
}

/**
 * 사용자의 알고리즘 문제와 풀이 코드에 대한 피드백을 생성하는 함수
 * @param content 알고리즘 문제 설명
 * @param code 사용자가 작성한 코드
 * @returns Promise<Feedback>
 */
export async function generateFeedback(
  content: string,
  code: string,
): Promise<Feedback> {
  const prompt = `
    다음은 알고리즘 문제와 사용자가 작성한 풀이 코드야:
    문제 설명: ${content}
    사용자 코드: ${code}

    사용자 코드에 대해 다음 항목을 포함하여 피드백을 제공해줘:
    - 시간복잡도 분석
    - 더 나은 최적화 방법이 있다면 제안
    - 가독성이나 코드 스타일 향상에 대한 제안
    - 개선된 코드 예시는 줄바꿈 처리 등 가독성을 고려하여 작성

    피드백은 반드시 JSON 형식으로 다음과 같은 형태로 응답해야 해:
    {
      "timeComplexity": "O(n)",
      "feedback": {
        "efficiency": "더 나은 시간 효율성을 위해 Heap 자료구조를 사용하는 것이 좋습니다.",
        "readability": "'a' 같은 변수명 대신 의미를 명확히 표현하는 이름을 사용하는 것이 좋습니다."
      },
      "aiImprovedCode": "function optimizedSolution(arr) { ... }"
    }
    예시 코드는 가독성을 고려하여 줄바꿈 처리 등을 반드시 포함해야 해.
  `

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 사용자의 코드를 분석하고 문제에 적합한 피드백과 개선점을 제공하는 AI 모델이야. 모든 응답은 JSON 형식으로 작성해야 해.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
    })

    if (response.choices && response.choices.length > 0) {
      let rawText = response.choices[0].message.content
      if (rawText) {
        rawText = rawText.replace(/```json|```/g, '')
        return JSON.parse(rawText) as Feedback
      } else {
        throw new Error('Response content is null')
      }
    } else {
      throw new Error('No choices returned in the response')
    }
  } catch (error) {
    console.error('Error generating feedback:', error)
    throw error
  }
}

export default generateFeedback
