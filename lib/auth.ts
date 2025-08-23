import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authoptions'
import { redirect } from 'next/navigation'

export interface UserRole {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  permissions: string[]
}

// 관리자 이메일 목록 (실제 환경에서는 데이터베이스에서 관리)
const ADMIN_EMAILS = [
  'admin@oneday-oneproblem.com',
  'jeonb@example.com', // 개발자 이메일
]

// 모더레이터 이메일 목록
const MODERATOR_EMAILS = ['moderator@oneday-oneproblem.com']

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return null
  }

  const email = session.user.email
  let role: 'user' | 'admin' | 'moderator' = 'user'
  let permissions: string[] = ['read:own']

  if (ADMIN_EMAILS.includes(email)) {
    role = 'admin'
    permissions = [
      'read:all',
      'write:all',
      'delete:all',
      'admin:performance',
      'admin:users',
      'admin:system',
    ]
  } else if (MODERATOR_EMAILS.includes(email)) {
    role = 'moderator'
    permissions = ['read:all', 'write:limited', 'moderate:content']
  }

  return {
    id: session.user.id || '',
    email,
    role,
    permissions,
  } as UserRole
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }
  return user
}

export async function requireModerator() {
  const user = await requireAuth()
  if (user.role !== 'admin' && user.role !== 'moderator') {
    redirect('/unauthorized')
  }
  return user
}

export function hasPermission(
  user: UserRole | null,
  permission: string,
): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}

export function canAccessPerformance(user: UserRole | null): boolean {
  return hasPermission(user, 'admin:performance')
}

export function canManageUsers(user: UserRole | null): boolean {
  return hasPermission(user, 'admin:users')
}

export function canManageSystem(user: UserRole | null): boolean {
  return hasPermission(user, 'admin:system')
}
