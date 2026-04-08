// app/api/questionnaire/route.ts
// Route POST — reçoit les réponses du questionnaire, calcule le score,
// sauvegarde en base et envoie vers le webhook n8n

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { calculerScoreChaleur } from '@/lib/score'
import { emailAdminLeadChaud } from '@/lib/brevo'

// Schéma de validation Zod
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
    // Validation des données entrantes
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Calcul du score de chaleur
    const { score, label } = calculerScoreChaleur({
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
    })

    // Sauvegarde en base Supabase (sans authentification requise)
    const supabase = createRouteHandlerClient({ cookies })
    const { error: dbError } = await supabase
      .from('questionnaire_reponses')
      .insert({
        q1: data.q1,
        q2: data.q2,
        q3: data.q3,
        q4: data.q4,
        q5: data.q5,
        score_chaleur: score,
        label_chaleur: label,
        prenom: data.prenom,
        commune: data.commune,
        email: data.email,
        telephone: data.telephone,
      })

    if (dbError) {
      console.error('[Questionnaire] Erreur Supabase:', dbError)
      // On continue même si la base échoue — le webhook reste prioritaire
    }

    // Envoi vers webhook n8n (non bloquant)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          score_chaleur: score,
          label_chaleur: label,
          source: 'questionnaire_verticall',
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error('[Questionnaire] Erreur webhook n8n:', err)
      })
    }

    // Notifier l'admin si lead chaud et email fourni
    if (label === 'chaud' && data.email) {
      await emailAdminLeadChaud({
        commune: data.commune || 'Inconnue',
        prenom: data.prenom || 'Inconnu',
        email: data.email,
        telephone: data.telephone,
        scoreChaleur: score,
      })
    }

    return NextResponse.json({
      success: true,
      score,
      label,
    })
  } catch (error) {
    console.error('[Questionnaire] Erreur inattendue:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
