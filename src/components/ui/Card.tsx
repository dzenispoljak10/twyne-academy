import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export default function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-neutral-200 p-6',
        hover && 'transition-shadow hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    />
  )
}
