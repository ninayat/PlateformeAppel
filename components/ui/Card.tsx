import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  variant?: 'default' | 'flat' | 'bordered'
}

export default function Card({ children, className, onClick, hoverable, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl',
        variant === 'default' && 'border border-green-pale shadow-card',
        variant === 'flat' && 'border border-gray-100',
        variant === 'bordered' && 'border-2 border-green-pale',
        hoverable && [
          'cursor-pointer',
          'hover:shadow-card-hover hover:border-green-light/40',
          'hover:-translate-y-0.5',
          'transition-all duration-200',
        ],
        !hoverable && 'p-5',
        hoverable && 'p-5 transition-all duration-200',
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
  return (
    <h3 className={cn('font-syne font-bold text-green-dark text-lg leading-tight', className)}>
      {children}
    </h3>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}
