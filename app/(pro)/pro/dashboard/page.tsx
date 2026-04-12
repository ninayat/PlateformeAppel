'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentUser, getOffresByPro, getAllAOs } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { Offre, AppelOffre } from '@/types'
import { StatutOffreBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant } from '@/lib/utils'

export default function ProDashboardPage() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [aos, setAos] = useState<AppelOffre[]>([])
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (!u) return
    setOffres(getOffresByPro(u.id))
    setAos(getAllAOs().filter((ao) => ao.statut === 'publie'))
  }, [])

  const profil = MOCK_PRO_PROFILES.find((p) => p.user_id === user?.id)

  const commission = offres
    .filter((o) => o.statut === 'selectionnee')
    .reduce((sum, o) => sum + o.montant * 0.025, 0)

  const stats = {
    offresEnCours: offres.filter((o) => o.statut === 'soumise').length,
    selectionnees: offres.filter((o) => o.statut === 'selectionnee').length,
    commission: Math.round(commission),
    aoDispos: aos.length,
  }

  return (
    <div className="max-w-4xl mx-auto fade-up">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-mid/60 mb-1">
            Espace Professionnel
          </p>
          <h1 className="font-syne font-extrabold text-2xl text-green-dark">
            Bonjour, {user?.prenom} 👋
          </h1>
          {profil && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-400">{profil.raison_sociale}</span>
              {profil.verifie ? (
                <span className="text-xs bg-green-pale text-green-mid font-semibold px-2 py-0.5 rounded-full">
                  ✓ Vérifié
                </span>
              ) : (
                <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                  En attente
                </span>
              )}
            </div>
          )}
        </div>
        <Link href="/pro/ao"
          className="inline-flex items-center gap-2 bg-green-mid text-white font-semibold
            text-sm px-5 py-2.5 rounded-xl hover:bg-green-dark transition-all shadow-sm
            hover:shadow-md hover:-translate-y-px">
          Voir les AO →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'AO disponibles', value: stats.aoDispos,         color: 'text-blue-600',   icon: '📋' },
          { label: 'Offres soumises', value: stats.offresEnCours,   color: 'text-green-mid',  icon: '📤' },
          { label: 'Contrats signés', value: stats.selectionnees,   color: 'text-green-dark', icon: '✅' },
          { label: 'Commission (2,5%)', value: formatMontant(stats.commission), color: 'text-accent', icon: '💰' },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <span className="text-xl">{s.icon}</span>
            <div className={`font-syne font-extrabold text-3xl ${s.color} mt-1`}>{s.value}</div>
            <div className="text-xs text-gray-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Note moyenne */}
      {profil && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card mb-6 flex items-center gap-6">
          <div className="text-center shrink-0">
            <div className="font-syne font-extrabold text-4xl text-green-mid">{profil.note_moyenne}</div>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(profil.note_moyenne) ? 'text-yellow-400' : 'text-gray-200'}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Note moyenne</div>
          </div>
          <div className="flex-1 border-l border-gray-100 pl-6">
            <div className="text-sm font-semibold text-green-dark">{profil.nb_contrats} contrats réalisés</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Départements : {profil.departements.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Mes dernières offres */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-lg text-green-dark">Mes dernières offres</h2>
        {offres.length > 0 && (
          <Link href="/pro/offres" className="text-xs text-green-mid font-medium hover:underline">
            Voir tout →
          </Link>
        )}
      </div>

      {offres.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-syne font-bold text-green-dark mb-2">Aucune offre soumise</h3>
          <p className="text-gray-400 text-sm mb-6">Parcourez les appels d&apos;offres disponibles et soumettez votre première offre.</p>
          <Link href="/pro/ao"
            className="inline-flex items-center gap-2 bg-green-mid text-white font-semibold
              text-sm px-5 py-2.5 rounded-xl hover:bg-green-dark transition-all">
            Parcourir les AO
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {offres.slice(0, 5).map((offre) => (
            <div key={offre.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card
                hover:shadow-card-hover hover:border-green-light/30 hover:-translate-y-0.5
                transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-green-dark">AO #{offre.ao_id}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{offre.description}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-syne font-bold text-green-mid">{formatMontant(offre.montant)}</div>
                    <div className="text-xs text-gray-400">Délai : {formatDate(offre.delai)}</div>
                  </div>
                  <StatutOffreBadge statut={offre.statut} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
