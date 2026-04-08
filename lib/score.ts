// Calcul du score des offres et du score de chaleur des leads
import type { Offre, AppelOffre, ScoreOffre } from '@/types'

/**
 * Calcule le score d'une offre pro sur 100
 * score = (note_pro / 5 * 40) + (points_delai * 30) + (points_prix * 30)
 */
export function calculerScoreOffre(offre: Offre, ao: AppelOffre): ScoreOffre {
  // Contribution note pro (0-40)
  const noteScore = (offre.pro_note / 5) * 40

  // Contribution délai (0-30)
  const dateSouhaitee = new Date(ao.date_souhaitee)
  const dateOffre = new Date(offre.delai)
  const diffJours = Math.ceil(
    (dateOffre.getTime() - dateSouhaitee.getTime()) / (1000 * 60 * 60 * 24)
  )
  let pointsDelai: number
  if (diffJours <= 0) pointsDelai = 100
  else if (diffJours <= 7) pointsDelai = 70
  else pointsDelai = 40
  const delaiScore = (pointsDelai / 100) * 30

  // Contribution prix (0-30)
  let pointsPrix: number
  if (ao.budget_min && offre.montant <= ao.budget_min) {
    pointsPrix = 100
  } else if (ao.budget_max && offre.montant <= ao.budget_max) {
    pointsPrix = 80
  } else {
    pointsPrix = 50
  }
  const prixScore = (pointsPrix / 100) * 30

  const score = Math.round(noteScore + delaiScore + prixScore)

  return {
    score,
    detail: {
      note: Math.round(noteScore),
      delai: Math.round(delaiScore),
      prix: Math.round(prixScore),
    },
  }
}

/**
 * Calcule le score de chaleur d'un lead questionnaire (0-100)
 * Retourne le score et le label : froid / tiède / chaud
 */
export function calculerScoreChaleur(reponses: {
  q1?: string
  q2?: string
  q3?: string
  q4?: string
  q5?: string
}): { score: number; label: 'froid' | 'tiede' | 'chaud' } {
  let score = 0

  // Q1 : Déjà fait appel à un pro ?
  if (reponses.q1 === 'oui_recemment') score += 30
  else if (reponses.q1 === 'oui_anciennement') score += 20
  else if (reponses.q1 === 'non_mais_interesse') score += 10

  // Q2 : Budget estimé
  if (reponses.q2 === 'plus_10000') score += 25
  else if (reponses.q2 === '5000_10000') score += 20
  else if (reponses.q2 === '1000_5000') score += 15
  else if (reponses.q2 === 'moins_1000') score += 5

  // Q3 : Délai
  if (reponses.q3 === 'urgent') score += 25
  else if (reponses.q3 === 'mois_prochain') score += 20
  else if (reponses.q3 === 'trimestre') score += 10
  else if (reponses.q3 === 'pas_urgent') score += 5

  // Q4 : Surface / volume
  if (reponses.q4 === 'grand') score += 10
  else if (reponses.q4 === 'moyen') score += 7
  else if (reponses.q4 === 'petit') score += 3

  // Q5 : Cahier des charges
  if (reponses.q5 === 'oui_complet') score += 10
  else if (reponses.q5 === 'partiel') score += 6
  else if (reponses.q5 === 'non') score += 2

  const label: 'froid' | 'tiede' | 'chaud' =
    score >= 65 ? 'chaud' : score >= 35 ? 'tiede' : 'froid'

  return { score, label }
}
