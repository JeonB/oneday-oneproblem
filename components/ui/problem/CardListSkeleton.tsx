import { Skeleton } from '../skeleton'

export default function CardListSkeleton() {
  return Array.from({ length: 20 }).map((_, index) => (
    <Skeleton key={index} className="h-32 w-32 rounded-lg md:h-40 md:w-40" />
  ))
}
