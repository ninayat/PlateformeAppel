import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(montant)
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

export const CATEGORIES_LABELS: Record<string, string> = {
  elagage: 'Élagage / Abattage',
  paysagisme: 'Paysagisme',
  entretien: 'Entretien',
  creation: 'Création',
  autre: 'Autre',
}

export const STATUT_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
}

export const STATUT_OFFRE_LABELS: Record<string, string> = {
  soumise: 'Soumise',
  vue: 'Vue',
  selectionnee: 'Sélectionnée',
  refusee: 'Refusée',
}

export const DEPARTEMENTS = [
  { code: '01', nom: 'Ain' },
  { code: '02', nom: 'Aisne' },
  { code: '06', nom: 'Alpes-Maritimes' },
  { code: '13', nom: 'Bouches-du-Rhône' },
  { code: '21', nom: 'Côte-d\'Or' },
  { code: '31', nom: 'Haute-Garonne' },
  { code: '33', nom: 'Gironde' },
  { code: '34', nom: 'Hérault' },
  { code: '38', nom: 'Isère' },
  { code: '42', nom: 'Loire' },
  { code: '44', nom: 'Loire-Atlantique' },
  { code: '59', nom: 'Nord' },
  { code: '67', nom: 'Bas-Rhin' },
  { code: '69', nom: 'Rhône' },
  { code: '75', nom: 'Paris' },
  { code: '76', nom: 'Seine-Maritime' },
  { code: '83', nom: 'Var' },
  { code: '92', nom: 'Hauts-de-Seine' },
  { code: '93', nom: 'Seine-Saint-Denis' },
  { code: '94', nom: 'Val-de-Marne' },
]
