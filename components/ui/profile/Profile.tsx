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

import { useSession } from 'next-auth/react'

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

interface UserStatsProps {
  streak: number
  totalProblemsSolved: number
}

export function ProfileForm({ streak, totalProblemsSolved }: UserStatsProps) {
  const { data: session } = useSession()
  const defaultValues: Partial<ProfileFormValues> = {
    username: session?.user?.name ?? '',
    password: '',
  }
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: ProfileFormValues) {
    // 서버에 업데이트 요청
    toast({
      title: '프로필이 업데이트되었습니다!',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 연속 풀이 횟수 (읽기 전용) */}
        <FormField
          control={form.control}
          name="streak"
          render={() => (
            <FormItem>
              <FormLabel>연속 풀이 횟수</FormLabel>
              <FormControl>
                <Input value={streak} readOnly />
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
          render={() => (
            <FormItem>
              <FormLabel>총 문제 풀이 횟수</FormLabel>
              <FormControl>
                <Input value={totalProblemsSolved} readOnly />
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
