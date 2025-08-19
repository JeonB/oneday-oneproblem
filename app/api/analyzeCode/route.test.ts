import { NextRequest } from 'next/server'
import { POST } from './route'
import { vi } from 'vitest'

describe('POST /api/analyzeCode', () => {
  it('should return parsed feedback with status 200', async () => {
    const mockRequest = {
      headers: {
        get: vi.fn().mockReturnValue('192.168.1.1'),
      },
      json: vi.fn().mockResolvedValue({
        generatedFeedback: JSON.stringify({
          timeComplexity: 'O(n)',
          feedback: 'Good job!',
          aiImprovedCode: 'const a = 1;',
        }),
      }),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const jsonResponse = response.data

    expect(response.status).toBe(200)
    expect(jsonResponse.results).toEqual({
      timeComplexity: 'O(n)',
      feedback: 'Good job!',
      aiImprovedCode: 'const a = 1;',
    })
  })

  it('should return error with status 500 on invalid JSON', async () => {
    const mockRequest = {
      headers: {
        get: vi.fn().mockReturnValue('192.168.1.1'),
      },
      json: vi.fn().mockResolvedValue({
        generatedFeedback: 'invalid JSON',
      }),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const jsonResponse = response.data

    expect(response.status).toBe(500)
    expect(jsonResponse.error).toBeDefined()
  })
})
