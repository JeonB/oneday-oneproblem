export type FeedbackState = {
  timeComplexity: string
  feedback: { efficiency: string; readability: string }
  aiImprovedCode: string
  error?: string
}

export const Feedback = (feedback: FeedbackState) => {
  return feedback.error ? (
    <div className="my-4 rounded-lg border border-red-500 bg-red-100 p-4 font-bold text-red-700">
      <p>{feedback.error}</p>
    </div>
  ) : (
    <div className="animate-fadeIn my-6 rounded-lg border border-gray-300 bg-slate-500 p-6 shadow-md md:w-5/6">
      <h3 className="mb-4 border-b-2 border-gray-300 pb-2 text-xl font-bold text-neutral-900">
        AI 피드백
      </h3>
      <p>
        <strong>시간 복잡도:</strong> {feedback.timeComplexity}
      </p>
      <p className="mt-2 flex items-center gap-2">
        <strong>효율성:</strong>
        <span className="rounded bg-cyan-100 px-2 py-1 text-sm text-cyan-700">
          {feedback.feedback.efficiency}
        </span>
      </p>
      <p className="mt-2 flex items-center gap-2">
        <strong>가독성:</strong>
        <span className="rounded bg-orange-100 px-2 py-1 text-sm text-orange-700">
          {feedback.feedback.readability}
        </span>
      </p>
      <div className="mt-4">
        <strong>개선된 코드:</strong>
        <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-900 p-4 text-gray-200">
          {feedback.aiImprovedCode}
        </pre>
      </div>
    </div>
  )
}
