'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllAOs, getCurrentUser } from '@/lib/store'
import type { AppelOffre } from '@/types'
import { StatutAOBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant, CATEGORIES_LABELS } from '@/lib/utils'

export default function ClientDashboardPage() {
  const [aos, setAos] = useState<AppelOffre[]>([])
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) setAos(getAllAOs().filter((ao) => ao.client_id === u.id))
  }, [])

  const stats = {
    total:    aos.length,
    publie:   aos.filter((a) => a.statut === 'publie').length,
    en_cours: aos.filter((a) => a.statut === 'en_cours').length,
    termine:  aos.filter((a) => a.statut === 'termine').length,
  }

  return (
    <div className="max-w-4xl mx-auto fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-mid/60 mb-1">
            Espace Client
          </p>
          <h1 className="font-syne font-extrabold text-2xl text-green-dark">
            Bonjour, {user?.prenom} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{user?.commune}</p>
        </div>
        <Link href="/client/ao/new"
          className="inline-flex items-center gap-2 bg-green-mid text-white font-semibold
            text-sm px-5 py-2.5 rounded-xl hover:bg-green-dark transition-all shadow-sm
            hover:shadow-md hover:-translate-y-px">
          <span className="text-base leading-none">+</span>
          Publier un AO
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total AO', value: stats.total, color: 'text-green-dark', icon: '📋' },
          { label: 'Publiés', value: stats.publie, color: 'text-green-mid', icon: '🟢' },
          { label: 'En cours', value: stats.en_cours, color: 'text-blue-600', icon: '🔵' },
          { label: 'Terminés', value: stats.termine, color: 'text-orange-500', icon: '✅' },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <span className="text-xl">{s.icon}</span>
            <div className={`font-syne font-extrabold text-3xl ${s.color} mt-1`}>{s.value}</div>
            <div className="text-xs text-gray-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste AOs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-lg text-green-dark">Mes appels d&apos;offres</h2>
        {aos.length > 0 && (
          <span className="text-xs text-gray-400">{aos.length} AO</span>
        )}
      </div>

      {aos.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-syne font-bold text-green-dark mb-2">Aucun appel d&apos;offres</h3>
          <p className="text-gray-400 text-sm mb-6">Publiez votre premier AO pour recevoir des propositions.</p>
          <Link href="/client/ao/new"
            className="inline-flex items-center gap-2 bg-green-mid text-white font-semibold
              text-sm px-5 py-2.5 rounded-xl hover:bg-green-dark transition-all">
            Publier un AO
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {aos.map((ao) => (
            <Link key={ao.id} href={`/client/ao/${ao.id}`}>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card
                hover:shadow-card-hover hover:border-green-light/30 hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <StatutAOBadge statut={ao.statut} />
                      <span className="text-xs text-gray-400">{CATEGORIES_LABELS[ao.categorie]}</span>
                    </div>
                    <h3 className="font-syne font-bold text-green-dark truncate">{ao.titre}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{ao.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-syne font-bold text-green-mid text-sm">
                      {ao.nb_offres} offre{ao.nb_offres !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(ao.date_souhaitee)}
                    </div>
                    {ao.budget_max && (
                      <div className="text-xs text-gray-400">
                        max {formatMontant(ao.budget_max)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
