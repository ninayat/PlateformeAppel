// GET /api/ao — liste des AO
// POST /api/ao — créer un AO
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { MOCK_AOS } from '@/lib/mock-data'

const schemaAO = z.object({
  titre: z.string().min(5).max(200),
  description: z.string().min(10),
  categorie: z.enum(['elagage', 'paysagisme', 'entretien', 'creation', 'autre']),
  departement: z.string().length(2),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  date_souhaitee: z.string(),
  statut: z.enum(['brouillon', 'publie']).default('publie'),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const departement = searchParams.get('departement')
  const statut = searchParams.get('statut')

  let aos = [...MOCK_AOS]
  if (departement) aos = aos.filter((a) => a.departement === departement)
  if (statut) aos = aos.filter((a) => a.statut === statut)

  return NextResponse.json(aos)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = schemaAO.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const newAO = {
      id: `ao-${Date.now()}`,
      ...result.data,
      client_id: body.client_id ?? 'unknown',
      client_nom: body.client_nom ?? '',
      client_commune: body.client_commune ?? '',
      nb_offres: 0,
      created_at: new Date().toISOString(),
    }

    // En prod : INSERT Supabase ici
    return NextResponse.json(newAO, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
