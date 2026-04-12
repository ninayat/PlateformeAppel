import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ScoreBar({ score, showLabel = true, size = 'md', className }: ScoreBarProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const color = clamped >= 70 ? 'bg-green-light' : clamped >= 45 ? 'bg-accent' : 'bg-red-400'
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 bg-gray-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          'font-syne font-bold w-10 text-right tabular-nums',
          size === 'sm' ? 'text-xs' : 'text-sm',
          clamped >= 70 ? 'text-green-mid' : clamped >= 45 ? 'text-accent-dark' : 'text-red-500'
        )}>
          {clamped}
        </span>
      )}
    </div>
  )
}

export function ScoreCircle({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score))
  const config =
    clamped >= 70
      ? { bg: 'bg-green-pale', text: 'text-green-mid', ring: 'ring-green-light/40' }
      : clamped >= 45
      ? { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-300/40' }
      : { bg: 'bg-red-50', text: 'text-red-500', ring: 'ring-red-300/40' }

  return (
    <div className={cn(
      'w-14 h-14 rounded-2xl flex flex-col items-center justify-center ring-1',
      config.bg, config.ring
    )}>
      <span className={cn('font-syne font-extrabold text-base leading-none', config.text)}>
        {clamped}
      </span>
      <span className="text-[9px] text-gray-400 mt-0.5">/ 100</span>
    </div>
  )
}
