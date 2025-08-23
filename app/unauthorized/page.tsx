import { ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <ShieldX className="mx-auto h-16 w-16 text-red-500" />
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          접근 권한이 없습니다
        </h1>

        <p className="mb-8 text-gray-600">
          이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
            홈으로 돌아가기
          </Link>

          <Link
            href="/profile"
            className="inline-block w-full rounded-lg bg-gray-200 px-6 py-3 text-gray-800 transition-colors hover:bg-gray-300">
            프로필로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}
