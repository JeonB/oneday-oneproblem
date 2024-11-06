import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// TODO: 생성 문제에대한 정답 검증을 추가해야 합니다.
export async function generateProblem(topic) {
  const prompt = `다음 주제와 관련된 알고리즘 문제를 한글로 작성해 : ${topic}. 문제는 다음과 같은 내용을 포함해야 해:
  - 문제 설명
  - 입력과 출력 조건(항상 '입력 조건', '출력 조건' 문구가 포함되어야 함)
  - 입력과 출력 예시(항상 '입력 예시', '출력 예시' 문구가 포함되어야 함)
  - 추가 설명이나 힌트는 작성하지 말 것
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
              text: '너는 알고리즘 문제를 작성하는 소프트웨어 엔지니어야. 응답은 반드시 html 형식으로 해. 그리고 최소한의 줄바꿈만 사용하고 문제를 읽는 사용자가 읽기 쉽게 응답 해줘.',
            },
          ],
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
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

export default generateProblem
