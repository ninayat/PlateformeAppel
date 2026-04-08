// Types centraux de la plateforme VertiCall

export type Role = 'client' | 'pro' | 'admin'

export interface User {
  id: string
  email: string
  role: Role
  prenom: string
  nom: string
  commune?: string
  telephone?: string
  created_at: string
}

export interface ProProfile {
  id: string
  user_id: string
  raison_sociale: string
  siret: string
  metier: 'elagueur' | 'paysagiste' | 'entretien' | 'autre'
  departements: string[] // ex: ['75', '92', '93']
  description: string
  note_moyenne: number
  nb_contrats: number
  verifie: boolean
  created_at: string
}

// Statuts possibles d'un appel d'offres
export type AOStatut =
  | 'brouillon'
  | 'publie'
  | 'en_cours'
  | 'termine'
  | 'annule'

export interface AppelOffre {
  id: string
  client_id: string
  client_nom: string
  client_commune: string
  titre: string
  description: string
  categorie: 'elagage' | 'paysagisme' | 'entretien' | 'creation' | 'autre'
  departement: string
  budget_min?: number
  budget_max?: number
  date_souhaitee: string // ISO date
  statut: AOStatut
  nb_offres: number
  created_at: string
}

// Statuts d'une offre pro
export type OffreStatut = 'soumise' | 'vue' | 'selectionnee' | 'refusee'

export interface Offre {
  id: string
  ao_id: string
  pro_id: string
  pro_nom: string
  pro_metier: string
  pro_note: number
  montant: number
  delai: string // ISO date de livraison proposée
  description: string
  statut: OffreStatut
  score?: number
  created_at: string
}

// Message de la messagerie
export interface Message {
  id: string
  conversation_id: string
  expediteur_id: string
  expediteur_nom: string
  expediteur_role: Role
  contenu: string
  lu: boolean
  created_at: string
}

export interface Conversation {
  id: string
  ao_id: string
  ao_titre: string
  client_id: string
  client_nom: string
  pro_id: string
  pro_nom: string
  dernier_message?: string
  dernier_message_at?: string
  nb_non_lus: number
}

// Questionnaire
export interface ReponseQuestionnaire {
  id: string
  q1?: string // Avez-vous déjà fait appel à un pro ?
  q2?: string // Quel est votre budget estimé ?
  q3?: string // Dans quel délai ?
  q4?: string // Quelle surface / volume ?
  q5?: string // Avez-vous un cahier des charges ?
  score_chaleur: number
  label_chaleur: 'froid' | 'tiede' | 'chaud'
  prenom?: string
  commune?: string
  email?: string
  telephone?: string
  created_at: string
}

// Résultat du calcul de score d'une offre
export interface ScoreOffre {
  score: number          // 0-100
  detail: {
    note: number         // contribution note pro (0-40)
    delai: number        // contribution délai (0-30)
    prix: number         // contribution prix (0-30)
  }
}
