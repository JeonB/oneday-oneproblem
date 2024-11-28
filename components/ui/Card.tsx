import React, { ReactNode } from 'react'
import Image from 'next/image'
import classes from './Card.module.css'

type CardProps = {
  algorithm: string
  topic: string
  img: string
}
function Card({ topic, algorithm, img }: CardProps) {
  return (
    <div className={classes.card}>
      <h2>{topic}</h2>
      <Image
        src={`images/${img}`}
        alt="logo"
        className={classes.logo}
        priority
        width={100}
        height={100}
      />
      <h3>{algorithm}</h3>
    </div>
  )
}

export default Card
