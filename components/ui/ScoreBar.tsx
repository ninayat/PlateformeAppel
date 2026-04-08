import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ScoreBar({ score, showLabel = true, size = 'md', className }: ScoreBarProps) {
  const color =
    score >= 70 ? 'bg-green-light' : score >= 45 ? 'bg-accent' : 'bg-red-400'

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 bg-gray-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-green-dark w-10 text-right">
          {score}
        </span>
      )}
    </div>
  )
}

// Version compacte avec cercle de score
export function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 70 ? 'text-green-mid bg-green-pale' : score >= 45 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'
  return (
    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center font-syne font-bold text-sm', color)}>
      {score}
    </div>
  )
}
