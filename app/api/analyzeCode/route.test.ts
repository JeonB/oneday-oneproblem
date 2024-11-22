import { NextRequest } from 'next/server'
import { POST } from './route'

describe('POST /api/analyzeCode', () => {
  it('should return parsed feedback with status 200', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        generatedFeedback: JSON.stringify({
          timeComplexity: 'O(n)',
          feedback: 'Good job!',
          aiImprovedCode: 'const a = 1;',
        }),
      }),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const jsonResponse = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResponse.results).toEqual({
      timeComplexity: 'O(n)',
      feedback: 'Good job!',
      aiImprovedCode: 'const a = 1;',
    })
  })

  it('should return error with status 500 on invalid JSON', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        generatedFeedback: 'invalid JSON',
      }),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const jsonResponse = await response.json()

    expect(response.status).toBe(500)
    expect(jsonResponse.error).toBeDefined()
  })
})
