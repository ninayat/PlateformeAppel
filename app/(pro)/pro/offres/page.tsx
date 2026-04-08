'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOffresByPro, getAOById, getCurrentUser } from '@/lib/store'
import type { Offre, AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import { StatutOffreBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant } from '@/lib/utils'

interface OffreAvecAO extends Offre {
  ao?: AppelOffre
}

export default function MesOffresPage() {
  const [offres, setOffres] = useState<OffreAvecAO[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    const raw = getOffresByPro(user.id)
    const enriched = raw.map((o) => ({
      ...o,
      ao: getAOById(o.ao_id) ?? undefined,
    }))
    setOffres(enriched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }, [])

  const stats = {
    total: offres.length,
    soumises: offres.filter((o) => o.statut === 'soumise').length,
    selectionnees: offres.filter((o) => o.statut === 'selectionnee').length,
    refusees: offres.filter((o) => o.statut === 'refusee').length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne font-bold text-2xl text-green-dark mb-2">Mes offres</h1>
      <p className="text-gray-500 text-sm mb-6">{stats.total} offres soumises au total</p>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total', value: stats.total },
          { label: 'En attente', value: stats.soumises },
          { label: 'Sélectionnées', value: stats.selectionnees },
          { label: 'Refusées', value: stats.refusees },
        ].map((s) => (
          <Card key={s.label} className="text-center py-3">
            <div className="font-syne font-bold text-2xl text-green-dark">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </Card>
        ))}
      </div>

      {offres.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-500 mb-4">Aucune offre soumise pour l&apos;instant.</p>
          <Link href="/pro/ao" className="text-green-mid hover:underline text-sm">
            Parcourir les AO disponibles →
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {offres.map((offre) => (
            <Card key={offre.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatutOffreBadge statut={offre.statut} />
                  </div>
                  <h3 className="font-syne font-bold text-green-dark text-base">
                    {offre.ao?.titre ?? `AO #${offre.ao_id}`}
                  </h3>
                  {offre.ao && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {offre.ao.client_nom} — {offre.ao.client_commune}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2 line-clamp-1">{offre.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-syne font-bold text-green-mid text-lg">
                    {formatMontant(offre.montant)}
                  </div>
                  <div className="text-xs text-gray-400">Délai : {formatDate(offre.delai)}</div>
                  {offre.statut === 'selectionnee' && (
                    <div className="text-xs text-green-mid font-bold mt-1">
                      Commission : {formatMontant(Math.round(offre.montant * 0.025))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
