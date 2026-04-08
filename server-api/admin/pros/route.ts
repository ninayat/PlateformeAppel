// GET /api/admin/pros — liste des pros (avec filtre vérification)
import { NextResponse } from 'next/server'
import { MOCK_PRO_PROFILES, MOCK_USERS } from '@/lib/mock-data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verifie = searchParams.get('verifie')

  let profils = [...MOCK_PRO_PROFILES]
  if (verifie === 'false') profils = profils.filter((p) => !p.verifie)
  if (verifie === 'true') profils = profils.filter((p) => p.verifie)

  const result = profils.map((p) => ({
    ...p,
    user: MOCK_USERS.find((u) => u.id === p.user_id),
  }))

  return NextResponse.json(result)
}
