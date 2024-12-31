import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { signIn } from 'next-auth/react'
import { useSignInAndUpStore } from '@/components/context/Store'
import { useDebouncedCallback } from 'use-debounce'

interface LoginFormProps {
  error?: string
  onSubmit: (e: React.FormEvent) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ error, onSubmit }) => {
  const { setEmail, setPassword } = useSignInAndUpStore()

  const debouncedSetEmail = useDebouncedCallback((value: string) => {
    setEmail(value)
  }, 300)

  const debouncedSetPassword = useDebouncedCallback((value: string) => {
    setPassword(value)
  }, 300)

  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>하단에 이메일을 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={e => debouncedSetEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline">
                  비밀번호를 잊으셨습니까?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                onChange={e => debouncedSetPassword(e.target.value)}
                required
              />
            </div>
            {error && <p>{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn('google')}>
              Google로 로그인
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <Link href="/sign-up" className="underline">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
export default LoginForm
