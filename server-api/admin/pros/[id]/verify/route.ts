// POST /api/admin/pros/[id]/verify — valider ou refuser un pro
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'

const schema = z.object({
  action: z.enum(['valider', 'refuser']),
  motif: z.string().optional(),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'action invalide' }, { status: 400 })
    }

    const profil = MOCK_PRO_PROFILES.find((p) => p.id === params.id)
    if (!profil) {
      return NextResponse.json({ error: 'Pro introuvable' }, { status: 404 })
    }

    // En prod : UPDATE Supabase + envoi email Brevo
    return NextResponse.json({
      success: true,
      profil_id: params.id,
      action: result.data.action,
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
