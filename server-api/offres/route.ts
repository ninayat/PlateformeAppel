// POST /api/offres — soumettre une offre
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schemaOffre = z.object({
  ao_id: z.string(),
  pro_id: z.string(),
  pro_nom: z.string(),
  pro_metier: z.string(),
  pro_note: z.number().min(0).max(5),
  montant: z.number().positive(),
  delai: z.string(),
  description: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = schemaOffre.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const newOffre = {
      id: `offre-${Date.now()}`,
      ...result.data,
      statut: 'soumise',
      created_at: new Date().toISOString(),
    }

    // En prod : INSERT Supabase + incrémenter nb_offres sur l'AO
    return NextResponse.json(newOffre, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
