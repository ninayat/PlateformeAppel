import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // Primary
          'bg-green-mid text-white hover:bg-green-dark focus:ring-green-mid shadow-sm hover:shadow-md hover:-translate-y-px':
            variant === 'primary',
          // Secondary
          'bg-green-pale text-green-dark hover:bg-green-light/25 focus:ring-green-light border border-green-light/30':
            variant === 'secondary',
          // Outline
          'border border-green-mid/40 text-green-mid hover:bg-green-pale hover:border-green-mid focus:ring-green-mid':
            variant === 'outline',
          // Ghost
          'text-green-mid hover:bg-green-pale/60 focus:ring-green-light':
            variant === 'ghost',
          // Danger
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm':
            variant === 'danger',
          // Dark (pour fonds sombres)
          'bg-white/10 text-white border border-white/15 hover:bg-white/15 focus:ring-white/30':
            variant === 'dark',
        },
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
