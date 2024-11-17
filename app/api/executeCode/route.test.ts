import { parseTestCases, generateDynamicTestCases, deepEqual } from './route' // solution 파일 경로

describe('parseTestCases', () => {
  it('should parse AI-generated content into test cases', () => {
    const aiGeneratedContent = [
      { input: '[[1, 2, 3]]', output: '2' },
      { input: '[[5, 6, 7]]', output: '-1' },
    ]

    const result = parseTestCases(aiGeneratedContent)

    expect(result).toEqual([
      { input: [[1, 2, 3]], output: 2 },
      { input: [[5, 6, 7]], output: -1 },
    ])
  })
})

describe('generateDynamicTestCases', () => {
  const mockSolution = (nums: number[]) => nums.indexOf(3)

  it('should generate valid dynamic test cases', () => {
    const constraints = { min: -10, max: 10, length: 5 }
    const testCases = generateDynamicTestCases(constraints, mockSolution)

    testCases.forEach(({ input, output }) => {
      const [nums] = input
      expect(nums.length).toBeLessThanOrEqual(constraints.length)
      nums.forEach((num: any) => {
        expect(num).toBeGreaterThanOrEqual(constraints.min)
        expect(num).toBeLessThanOrEqual(constraints.max)
      })
      expect(output).toEqual(mockSolution(nums))
    })
  })
})

describe('deepEqual', () => {
  it('should return true for equal primitive values', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual('test', 'test')).toBe(true)
  })

  it('should return false for unequal primitive values', () => {
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual('test', 'TEST')).toBe(false)
  })

  it('should return true for equal arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for unequal arrays', () => {
    expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false)
  })
})

describe('Integration Test', () => {
  const mockCode = `
    function solution(nums) {
      return nums.indexOf(3);
    }
  `

  it('should evaluate user code against test cases', () => {
    const aiGeneratedContent = [
      { input: '[[1, 2, 3, 4]]', output: '2' },
      { input: '[[5, 6, 7, 8]]', output: '-1' },
    ]

    const testCases = parseTestCases(aiGeneratedContent)
    const constraints = { min: -10, max: 10, length: 5 }
    const dynamicTestCases = generateDynamicTestCases(constraints, nums =>
      nums.indexOf(3),
    )

    const wrappedCode = `
      ${mockCode}
      return solution;
    `

    const solution = new Function(wrappedCode)()

    // Combine all test cases
    const allTestCases = [...testCases, ...dynamicTestCases]

    allTestCases.forEach(({ input, output }) => {
      const result = solution(...input)
      expect(deepEqual(result, output)).toBe(true)
    })
  })
})
