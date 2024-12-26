import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function generateFeedback(code) {
  const prompt = `다음 코드에 대하여 피드백을 제공해줘 : ${code}. 피드백은 다음과 같은 내용을 순서대로 포함해야 해:
  - 시간복잡도 분석
  - 더 나은 최적화 방법이 있으면 제안
  - 가독성이나 코드 스타일 향상에 대한 제안
  - 최종적으로 다음과 같은 예시 형태로 응답해야 돼. "timeComplexity": "O(n)",
  "feedback": {
    "efficiency": "더 나은 시간 효율성을 위해 Heap을 사용해보세요.",
    "readability": "'a'같은 변수보다는 'sum'처럼 변수의 의미를 알기 쉽게 변경해보세요."
  },
  "aiImprovedCode": "function optimizedSolution(arr) { ... }"
  `

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: '너는 사용자의 코드를 분석하고 개선점을 제안 해주는 AI 모델이야.응답은 json 형식으로 해줘.',
            },
          ],
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    })

    if (response.choices && response.choices.length > 0) {
      const rawText = response.choices[0].message.content
      return rawText
    } else {
      throw new Error('No choices returned in the response')
    }
  } catch (error) {
    console.error('Error generating problem:', error)
    throw error
  }
}

export default generateFeedback
