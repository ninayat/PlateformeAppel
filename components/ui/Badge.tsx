import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'green'
  | 'blue'
  | 'orange'
  | 'red'
  | 'gray'
  | 'yellow'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-pale text-green-mid border border-green-light/40',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Badge spécifique pour les statuts AO
export function StatutAOBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    brouillon: { label: 'Brouillon', variant: 'gray' },
    publie: { label: 'Publié', variant: 'green' },
    en_cours: { label: 'En cours', variant: 'blue' },
    termine: { label: 'Terminé', variant: 'orange' },
    annule: { label: 'Annulé', variant: 'red' },
  }
  const c = config[statut] ?? { label: statut, variant: 'gray' as BadgeVariant }
  return <Badge variant={c.variant}>{c.label}</Badge>
}

// Badge pour les statuts d'offre
export function StatutOffreBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    soumise: { label: 'Soumise', variant: 'blue' },
    vue: { label: 'Vue', variant: 'yellow' },
    selectionnee: { label: 'Sélectionnée', variant: 'green' },
    refusee: { label: 'Refusée', variant: 'red' },
  }
  const c = config[statut] ?? { label: statut, variant: 'gray' as BadgeVariant }
  return <Badge variant={c.variant}>{c.label}</Badge>
}
