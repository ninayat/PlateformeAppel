// POST /api/offres/[id]/select — sélectionner une offre
import { NextResponse } from 'next/server'
import { MOCK_OFFRES } from '@/lib/mock-data'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const offre = MOCK_OFFRES.find((o) => o.id === params.id)
  if (!offre) {
    return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
  }

  // En prod :
  // 1. UPDATE offres SET statut='selectionnee' WHERE id = params.id
  // 2. UPDATE offres SET statut='refusee' WHERE ao_id = offre.ao_id AND id != params.id
  // 3. UPDATE appels_offres SET statut='termine' WHERE id = offre.ao_id

  return NextResponse.json({
    success: true,
    offre_id: params.id,
    ao_id: offre.ao_id,
  })
}
