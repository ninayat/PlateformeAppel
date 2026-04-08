// GET /api/messages?conversation_id=xxx — messages d'une conversation
// POST /api/messages — envoyer un message
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MOCK_MESSAGES } from '@/lib/mock-data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const convId = searchParams.get('conversation_id')

  if (!convId) {
    return NextResponse.json({ error: 'conversation_id requis' }, { status: 400 })
  }

  const messages = MOCK_MESSAGES
    .filter((m) => m.conversation_id === convId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return NextResponse.json(messages)
}

const schemaMessage = z.object({
  conversation_id: z.string(),
  expediteur_id: z.string(),
  expediteur_nom: z.string(),
  expediteur_role: z.enum(['client', 'pro']),
  contenu: z.string().min(1).max(2000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = schemaMessage.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      ...result.data,
      lu: false,
      created_at: new Date().toISOString(),
    }

    // En prod : INSERT Supabase ici
    return NextResponse.json(newMessage, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
