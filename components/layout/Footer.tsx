'use client'
import { usePathname } from 'next/navigation'

export const Footer = () => {
  const pathname = usePathname()
  const isProblemPage = pathname.startsWith('/problem')
  return (
    <>
      {!isProblemPage && (
        <div className="mx-auto my-4 flex max-w-4xl justify-between py-4">
          <div className="px-4">
            <div>
              <p className="text-xs md:text-sm">주소 : 서울 관악구 행운4길</p>
            </div>

            <div>
              <p className="mt-4 text-xs md:text-sm">
                대표번호 : 010-4233-5481
              </p>
            </div>
          </div>

          <div className="pr-4">
            <div>
              <p className="text-xs md:text-sm">
                본 사이트의 콘텐츠는 저작권법의 보호를 받으며, 무단 전재, 복사,
                재배포 등을 금합니다.
              </p>
            </div>
            <p className="mt-4 text-xs md:text-sm">
              &copy; 2001 - {new Date().getFullYear()} JeonB All Rights
              Reserved.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
