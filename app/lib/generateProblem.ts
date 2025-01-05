import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function generateProblem(topic: string, difficulty: string) {
  const prompt = `
다음 주제에 관한 알고리즘 문제를 한국어로 작성해: ${topic}. 난이도는 ${difficulty}로 설정해.
${topic}이 "random"인 경우, 임의의 주제를 선택해.
문제는 특정 프로그래밍 언어에 의존하지 않아야 하며, Java, JavaScript, C, C++, Python에서 해결할 수 있어야 해.
아래와 같은 구조로 문제를 작성해:
1. **문제 설명**: 함수 형태나 언어별 구체적인 문법을 요구하지 마. 함수의 목적과 반환값만 설명해.
2. **제한 사항**: 입력 데이터에 대한 크기, 범위, 조건을 구체적으로 명시해.
3. **입출력 예시**:
   - 각 테스트 케이스에 대해 입력 변수와 출력 변수를 포함하여 명확히 작성해.
   - **입력 변수명과 출력 변수명은 반드시 영어로 적절한 변수명을 설정**해.
   - **출력 변수명은 반드시 result 또는 answer로 설정**해.
   - 각 입력 값과 예상 출력 값을 **표 형식**으로 나열해.
4. **입출력 예 설명**: 각 테스트 케이스에 대한 동작 원리를 간단히 설명해.
문제는 읽기 쉽고 명확한 문장으로 구성해야 하며, 수학적 논리나 알고리즘적 사고를 요구하는 형태로 작성해야 해. 또한, 직접적으로 특정 알고리즘으로 풀이 방법을 제시하지 않아야 해.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `
          너는 알고리즘 문제를 작성하는 배테랑 소프트웨어 엔지니어야.
          응답은 반드시 HTML 형식으로 작성해야 하며, 다음 구조를 따라야 해:
          <h2>문제 설명</h2>
          <p>[문제 설명]</p>
          <h3>제한 사항</h3>
          <ul>
            <li>[제한 사항 항목]</li>
          </ul>
          <h3>입출력 예시</h3>
          <table>
            <thead>
              <tr>
                <th>[입력 변수]</th>
                <th>[출력 변수]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>[입력 변수값]</td>
                <td>[출력 변수값]</td>
              </tr>
            </tbody>
          </table>
          <h3>입출력 예 설명</h3>
          <p>[예시 설명]</p>
          `,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
    })

    if (response.choices && response.choices.length > 0) {
      const rawText = response.choices[0].message.content
      const cleanHTMLResponse = (response: string) => {
        response = response.replace(/```html|```/g, '')
        response = response.replaceAll(
          /(문제 설명|제한 사항|입출력 예시|입출력 예 설명|입출력 예:\s.*?)/g,
          '<br>$1<br><br>',
        )
        response = response.replace(
          /<table>/g,
          '<table class="table-auto w-full border-collapse">',
        )
        response = response.replace(/<th>/g, '<th class="px-4 py-2 border">')
        response = response.replace(/<td>/g, '<td class="px-4 py-2 border">')
        return response
      }
      if (rawText) {
        return cleanHTMLResponse(rawText)
      }
      return new Error('문제가 생성되지 않았습니다.')
    } else {
      throw new Error('No choices returned in the response')
    }
  } catch (error) {
    console.error('Error generating problem:', error)
    throw error
  }
}

export default generateProblem
