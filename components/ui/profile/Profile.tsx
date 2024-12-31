'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signOut, useSession } from 'next-auth/react'
import { useAuthStore } from '@/components/context/Store'
import { useRouter } from 'next/navigation'

// 유효성 검사 스키마
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: '사용자 이름은 최소 2글자 이상이어야 합니다.',
    })
    .max(30, {
      message: '사용자 이름은 30글자를 넘을 수 없습니다.',
    }),
  password: z.string().min(6, {
    message: '비밀번호는 최소 6글자 이상이어야 합니다.',
  }),
  totalProblemsSolved: z.number(),
  streak: z.number(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type ProfileFormProps = {
  defaultValues: Partial<ProfileFormValues>
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })
  const { data: session } = useSession()
  const { loginState, setLoginState } = useAuthStore()
  const router = useRouter()
  async function onSubmit(data: ProfileFormValues) {
    try {
      // 서버에 데이터 전송
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          name: data.username,
          password: data.password,
        }),
      })

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.')
      }

      const result = await response.json()

      toast({
        title: '프로필 업데이트 성공!',
        description: (
          <div className="text-center text-white">
            <p className="font-bold">다시 로그인해주세요.</p>
          </div>
        ),
        className: 'bg-green-500 text-white p-4 rounded-lg shadow-lg',
      })

      //세션을 로그아웃하고 루트 페이지로 이동
      await signOut({ redirect: false })
      setLoginState(false)
      router.push('/')
    } catch (error) {
      toast({
        title: '오류 발생',
        description: (error as Error).message,
        variant: 'destructive',
        className: 'bg-red-500 text-white p-4 rounded-lg shadow-lg',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 연속 풀이 횟수 (읽기 전용) */}
        <FormField
          control={form.control}
          name="streak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연속 풀이 횟수</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormDescription>
                현재 하루 연속 문제 풀이 횟수입니다.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* 총 문제 풀이 횟수 (읽기 전용) */}
        <FormField
          control={form.control}
          name="totalProblemsSolved"
          render={({ field }) => (
            <FormItem>
              <FormLabel>총 문제 풀이 횟수</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormDescription>
                지금까지 풀었던 문제의 총 개수입니다.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* 사용자 이름 수정 가능 */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자 이름</FormLabel>
              <FormControl>
                <Input placeholder="사용자 이름을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 비밀번호 수정 가능 */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 업데이트 버튼 */}
        <Button type="submit">프로필 업데이트</Button>
      </form>
    </Form>
  )
}
