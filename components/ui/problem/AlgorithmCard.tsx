import React, { ReactNode } from 'react'
import Image from 'next/image'

type CardProps = {
  algorithm: string
  topic: string
  img: string
  onClick?: () => void
}
function Card({ topic, algorithm, img, onClick }: CardProps) {
  return (
    <div
      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg bg-[#dbd0c4] shadow-lg hover:bg-[#b8a89a] md:h-40 md:w-40"
      onClick={onClick}>
      <h1 className="mb-2 text-center text-lg text-slate-900 md:text-xl">
        {algorithm}
      </h1>
      <Image
        src={img}
        alt="logo"
        className="hidden md:mx-auto md:block"
        width={100}
        height={100}
      />
      <Image
        src={img}
        alt="logo"
        className="block md:hidden"
        width={50}
        height={50}
      />
    </div>
  )
}

export default Card
