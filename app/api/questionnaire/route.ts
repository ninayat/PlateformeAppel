// POST /api/questionnaire — sauvegarder les réponses et calculer le score de chaleur
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { calculerScoreChaleur } from '@/lib/score'

const schema = z.object({
  q1: z.string().optional(),
  q2: z.string().optional(),
  q3: z.string().optional(),
  q4: z.string().optional(),
  q5: z.string().optional(),
  prenom: z.string().optional(),
  commune: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telephone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data
    const { score, label } = calculerScoreChaleur({
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
    })

    // En prod :
    // 1. INSERT Supabase questionnaire_reponses
    // 2. fetch(N8N_WEBHOOK_URL, ...) si process.env.N8N_WEBHOOK_URL
    // 3. emailAdminLeadChaud si label === 'chaud'

    return NextResponse.json({ success: true, score, label })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
