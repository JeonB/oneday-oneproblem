import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// TODO: 생성 문제에대한 정답 검증을 추가해야 합니다.
export async function generateProblem(topic) {
  const prompt = `다음 주제와 관련된 알고리즘 문제를 한글로 작성해 : ${topic}. 문제는 solution 함수와 인자가 주어지면(예를 들어, solution(t,p)) 그 함수를 수정하여 문제를 풀 수 있어여야 해. 또한, 다음과 같은 내용을 순서대로 포함해야 해:
  - 문제 설명(문제는 java,javascript,c,c++,python 중 하나로 구현할 수 있는 형태여야하며 특정 언어의 문법이나 내장 라이브러리에 대한 조건이 없어야 함. 또한, 함수가 어떤 형태여야 한다고 하지 말고 어떤 값을 반환해야 하는지만 알려줘야 함.)
  - 제한 사항
  - 입출력 예시(예를 들어, 작성해야하는 함수가 solution(diffs, times, limit)면 diffs	times	limit	result
[1, 5, 3]	[2, 4, 7]	30	3
[1, 4, 4, 2]	[6, 3, 8, 2]	59	2
[1, 328, 467, 209, 54]	[2, 7, 1, 4, 3]	1723	294
[1, 99999, 100000, 99995]	[9999, 9001, 9999, 9001]	3456789012	39354 처럼 변수와 그 값을 항상 표기해야 함.)
  - 입출력 예 설명(입출력 예 #1, 입출력 예 #2 형태로 표기)
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

export default generateProblem
