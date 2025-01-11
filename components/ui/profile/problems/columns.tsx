'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ProblemProps } from '@/app/lib/models/Problem'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

export const columns: ColumnDef<ProblemProps>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className="text-md text-center md:text-lg"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            풀이 날짜
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt ?? '')
      const formattedDate = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .format(date)
        .replace(/.$/, '')
      return <div className="text-center font-medium">{formattedDate}</div>
    },
  },
  {
    accessorKey: 'topic',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className="text-md text-center md:text-lg"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            주제
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="md:text-md text-center text-sm">
          {row.original.topic}
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className="text-md text-center md:text-lg"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            제목
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="md:text-md text-center text-sm">
          {row.original.title}
        </div>
      )
    },
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className="text-md text-center md:text-lg"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            난이도
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div
          className={clsx(
            'md:text-md text-center text-sm',
            row.original.difficulty === 'easy'
              ? 'text-green-500'
              : row.original.difficulty === 'normal'
                ? 'text-yellow-500'
                : 'text-red-500',
          )}>
          {row.original.difficulty}
        </div>
      )
    },
  },
]
