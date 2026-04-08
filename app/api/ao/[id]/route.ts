// GET /api/ao/[id] — détail d'un AO
// PATCH /api/ao/[id] — modifier le statut
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MOCK_AOS } from '@/lib/mock-data'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ao = MOCK_AOS.find((a) => a.id === params.id)
  if (!ao) {
    return NextResponse.json({ error: 'AO introuvable' }, { status: 404 })
  }
  return NextResponse.json(ao)
}

const schemaPatch = z.object({
  statut: z.enum(['brouillon', 'publie', 'en_cours', 'termine', 'annule']).optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const result = schemaPatch.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const ao = MOCK_AOS.find((a) => a.id === params.id)
    if (!ao) {
      return NextResponse.json({ error: 'AO introuvable' }, { status: 404 })
    }

    // En prod : UPDATE Supabase ici
    const updated = { ...ao, ...result.data }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
