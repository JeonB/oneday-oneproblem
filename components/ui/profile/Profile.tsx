'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
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
import { useAuthStore } from '@/components/context/StoreContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  password: z
    .string()
    .min(4, {
      message: '비밀번호는 최소 4글자 이상이어야 합니다.',
    })
    .max(30, {
      message: '비밀번호는 30글자를 넘을 수 없습니다.',
    }),
  totalProblemsSolved: z.number(),
  streak: z.number(),
  profileImage: z.any().optional(),
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
  const setLoginState = useAuthStore(state => state.setLoginState)
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      form.setValue('profileImage', file)
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    try {
      const formData = new FormData()
      formData.append('email', session?.user?.email || '')
      formData.append('name', data.username)
      formData.append('password', data.password)
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage)
      }

      // 서버에 데이터 전송
      const response = await fetch('/api/user', {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.')
      }

      toast({
        title: '프로필 업데이트 성공!',
        description: (
          <div className="text-center text-white">
            <p className="font-bold">다시 로그인해주세요.</p>
          </div>
        ),
        className: 'bg-green-500 text-white p-4 rounded-lg shadow-lg',
      })

      // 세션을 로그아웃하고 루트 페이지로 이동
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

  useEffect(() => {
    if (defaultValues.profileImage) {
      setPreview(defaultValues.profileImage as string)
    }
  }, [defaultValues.profileImage])

  return (
    <div className="mx-auto w-64 rounded-lg bg-stone-300 p-6 shadow-md md:w-80">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 연속 풀이 횟수 (읽기 전용) */}
          <FormField
            control={form.control}
            name="streak"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">연속 풀이 횟수</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="text-black" />
                </FormControl>
                <FormDescription className="text-gray-500">
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
                <FormLabel className="text-black">총 문제 풀이 횟수</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="text-black" />
                </FormControl>
                <FormDescription className="text-gray-500">
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
                <FormLabel className="text-black">사용자 이름</FormLabel>
                <FormControl>
                  <Input
                    placeholder="사용자 이름을 입력하세요"
                    {...field}
                    className="border-sky-600 text-black"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* 비밀번호 수정 가능 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                    {...field}
                    className="border-sky-600 text-black"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* 이미지 수정 가능 */}
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">프로필 이미지</FormLabel>
                <FormControl>
                  <Input
                    id="picture"
                    type="file"
                    placeholder="프로필 이미지를 업로드하세요"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </FormControl>

                <div className="mt-2">
                  <Image
                    onClick={() => document.getElementById('picture')?.click()}
                    src={preview || '/images/avatar-placeholder.png'}
                    alt="Profile Preview"
                    width={80}
                    height={80}
                    className="h-20 w-20 cursor-pointer rounded-full object-cover"
                  />
                </div>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* 업데이트 버튼 */}
          <Button type="submit">프로필 업데이트</Button>
        </form>
      </Form>
    </div>
  )
}
