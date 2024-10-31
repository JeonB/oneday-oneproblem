import OpenAI from 'openai'
const openai = new OpenAI()

export async function generateProblem(topic) {
  const prompt = `Generate an algorithm problem related to ${topic}. The problem should be solvable in any programming language. Include:
  - A problem statement
  - Input and output requirements
  - Example input-output pairs`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a software engineer who is writing an algorithm problem.',
        },
        {
          role: 'system',
          content: 'Problem:',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
    })

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message
    } else {
      throw new Error('No choices returned in the response')
    }
  } catch (error) {
    console.error('Error generating problem:', error)
    throw error
  }
}

export default generateProblem
// generateProblem('sorting')
//   .then(problem => console.log('Generated Problem:\n', problem))
//   .catch(error => console.error('Error generating problem:', error))
