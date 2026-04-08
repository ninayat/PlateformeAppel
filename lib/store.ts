'use client'
// Gestion de l'état local (simulation auth + données sans Supabase)
import type { User, AppelOffre, Offre, Message } from '@/types'
import {
  MOCK_USERS,
  MOCK_AOS,
  MOCK_OFFRES,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from './mock-data'

const USER_KEY = 'verticall_user'

// --- Auth locale ---

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function login(email: string, _password: string): User | null {
  const user = MOCK_USERS.find((u) => u.email === email)
  if (!user) return null
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(USER_KEY)
}

export function register(data: {
  email: string
  prenom: string
  nom: string
  role: 'client' | 'pro'
  commune?: string
  telephone?: string
}): User {
  const newUser: User = {
    id: `user-${Date.now()}`,
    ...data,
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  return newUser
}

// --- AOs ---

function getAOs(): AppelOffre[] {
  if (typeof window === 'undefined') return MOCK_AOS
  const raw = localStorage.getItem('verticall_aos')
  if (!raw) return MOCK_AOS
  try {
    return JSON.parse(raw) as AppelOffre[]
  } catch {
    return MOCK_AOS
  }
}

function saveAOs(aos: AppelOffre[]) {
  localStorage.setItem('verticall_aos', JSON.stringify(aos))
}

export function getAllAOs(): AppelOffre[] {
  return getAOs()
}

export function getAOById(id: string): AppelOffre | null {
  return getAOs().find((ao) => ao.id === id) ?? null
}

export function getAOsByClient(clientId: string): AppelOffre[] {
  return getAOs().filter((ao) => ao.client_id === clientId)
}

export function getAOsByDepartement(departement: string): AppelOffre[] {
  return getAOs().filter(
    (ao) => ao.departement === departement && ao.statut === 'publie'
  )
}

export function createAO(
  data: Omit<AppelOffre, 'id' | 'nb_offres' | 'created_at'>
): AppelOffre {
  const aos = getAOs()
  const newAO: AppelOffre = {
    ...data,
    id: `ao-${Date.now()}`,
    nb_offres: 0,
    created_at: new Date().toISOString(),
  }
  saveAOs([...aos, newAO])
  return newAO
}

export function updateAOStatut(id: string, statut: AppelOffre['statut']) {
  const aos = getAOs()
  saveAOs(aos.map((ao) => (ao.id === id ? { ...ao, statut } : ao)))
}

// --- Offres ---

function getOffres(): Offre[] {
  if (typeof window === 'undefined') return MOCK_OFFRES
  const raw = localStorage.getItem('verticall_offres')
  if (!raw) return MOCK_OFFRES
  try {
    return JSON.parse(raw) as Offre[]
  } catch {
    return MOCK_OFFRES
  }
}

function saveOffres(offres: Offre[]) {
  localStorage.setItem('verticall_offres', JSON.stringify(offres))
}

export function getOffresByAO(aoId: string): Offre[] {
  return getOffres().filter((o) => o.ao_id === aoId)
}

export function getOffresByPro(proId: string): Offre[] {
  return getOffres().filter((o) => o.pro_id === proId)
}

export function createOffre(data: Omit<Offre, 'id' | 'created_at'>): Offre {
  const offres = getOffres()
  const newOffre: Offre = {
    ...data,
    id: `offre-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  saveOffres([...offres, newOffre])
  // Incrémenter nb_offres sur l'AO
  const aos = getAOs()
  saveAOs(
    aos.map((ao) =>
      ao.id === data.ao_id ? { ...ao, nb_offres: ao.nb_offres + 1 } : ao
    )
  )
  return newOffre
}

export function selectionnerOffre(offreId: string, aoId: string) {
  const offres = getOffres()
  saveOffres(
    offres.map((o) => {
      if (o.ao_id !== aoId) return o
      return { ...o, statut: o.id === offreId ? 'selectionnee' : 'refusee' }
    })
  )
  updateAOStatut(aoId, 'termine')
}

// --- Messages ---

function getMessages(): Message[] {
  if (typeof window === 'undefined') return MOCK_MESSAGES
  const raw = localStorage.getItem('verticall_messages')
  if (!raw) return MOCK_MESSAGES
  try {
    return JSON.parse(raw) as Message[]
  } catch {
    return MOCK_MESSAGES
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem('verticall_messages', JSON.stringify(msgs))
}

export function getMessagesByConversation(convId: string): Message[] {
  return getMessages()
    .filter((m) => m.conversation_id === convId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
}

export function sendMessage(data: Omit<Message, 'id' | 'lu' | 'created_at'>): Message {
  const msgs = getMessages()
  const newMsg: Message = {
    ...data,
    id: `msg-${Date.now()}`,
    lu: false,
    created_at: new Date().toISOString(),
  }
  saveMessages([...msgs, newMsg])
  return newMsg
}

export function getConversations() {
  if (typeof window === 'undefined') return MOCK_CONVERSATIONS
  const raw = localStorage.getItem('verticall_conversations')
  if (!raw) return MOCK_CONVERSATIONS
  try {
    return JSON.parse(raw)
  } catch {
    return MOCK_CONVERSATIONS
  }
}
