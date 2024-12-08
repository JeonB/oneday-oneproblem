'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpFormProps {
  name: string
  email: string
  password: string
  // confirmPassword: string
  error: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  // onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const CardsCreateAccount: React.FC<SignUpFormProps> = ({
  name,
  email,
  password,
  // confirmPassword,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  // onConfirmPasswordChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-auto w-full max-w-lg p-6 lg:max-w-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">1일 1문제 계정 생성</CardTitle>
          <CardDescription>하단에 이메일을 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-8">
            <Button variant="outline">
              <Icons.gitHub />
              Github
            </Button>
            <Button variant="outline">
              <Icons.google />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            <Label htmlFor="name">닉네임</Label>
            <Input
              id="name"
              placeholder="홍길동"
              value={name}
              onChange={e => onNameChange(e.target.value)}
            />
          </div>
          <div className="grid gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="m@example.com"
              onChange={e => onEmailChange(e.target.value)}
            />
          </div>
          <div className="grid gap-4">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          {error && <p>{error}</p>}
          <Button className="w-full" type="submit">
            계정 생성
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default CardsCreateAccount
