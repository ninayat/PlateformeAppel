import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export default function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-green-pale/80 shadow-sm p-5',
        hoverable && 'cursor-pointer hover:shadow-md hover:border-green-light/50 transition-all',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-syne font-700 text-green-dark text-lg', className)}>{children}</h3>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mt-4 pt-4 border-t border-green-pale', className)}>{children}</div>
}
