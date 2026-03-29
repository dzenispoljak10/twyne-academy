import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  firstName?: string | null
  lastName?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-lg' }

export default function Avatar({ src, firstName, lastName, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center bg-primary text-white font-semibold flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt="Avatar" fill className="object-cover" />
      ) : (
        <span>{getInitials(firstName, lastName)}</span>
      )}
    </div>
  )
}
