'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOffresByPro, getAOById, getCurrentUser } from '@/lib/store'
import type { Offre, AppelOffre } from '@/types'
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
    <div className="max-w-4xl mx-auto fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-mid/60 mb-1">
          Suivi commercial
        </p>
        <h1 className="font-syne font-extrabold text-2xl text-green-dark">Mes offres</h1>
        <p className="text-gray-400 text-sm mt-0.5">{stats.total} offres soumises au total</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',          value: stats.total,          color: 'text-green-dark' },
          { label: 'En attente',     value: stats.soumises,       color: 'text-blue-600'   },
          { label: 'Sélectionnées',  value: stats.selectionnees,  color: 'text-green-mid'  },
          { label: 'Refusées',       value: stats.refusees,       color: 'text-red-400'    },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div className={`font-syne font-extrabold text-3xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {offres.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-syne font-bold text-green-dark mb-2">Aucune offre soumise</h3>
          <p className="text-gray-400 text-sm mb-6">Parcourez les appels d&apos;offres disponibles pour soumettre votre première offre.</p>
          <Link href="/pro/ao"
            className="inline-flex items-center gap-2 bg-green-mid text-white font-semibold
              text-sm px-5 py-2.5 rounded-xl hover:bg-green-dark transition-all">
            Parcourir les AO →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {offres.map((offre) => (
            <div key={offre.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card
                hover:shadow-card-hover hover:border-green-light/30 transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
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
                  <p className="text-sm text-gray-400 mt-2 line-clamp-1">{offre.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-syne font-bold text-green-mid text-lg">
                    {formatMontant(offre.montant)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">Délai : {formatDate(offre.delai)}</div>
                  {offre.statut === 'selectionnee' && (
                    <div className="text-xs font-semibold text-green-mid mt-1 bg-green-pale/50 px-2 py-0.5 rounded-full">
                      Commission : {formatMontant(Math.round(offre.montant * 0.025))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
