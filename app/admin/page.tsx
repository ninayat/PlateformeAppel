'use client'
import { useEffect, useState } from 'react'
import { getAllAOs } from '@/lib/store'
import { MOCK_USERS, MOCK_PRO_PROFILES, MOCK_OFFRES } from '@/lib/mock-data'
import type { AppelOffre } from '@/types'
import { StatutAOBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [aos, setAos] = useState<AppelOffre[]>([])

  useEffect(() => {
    setAos(getAllAOs())
  }, [])

  const nbClients = MOCK_USERS.filter((u) => u.role === 'client').length
  const nbPros = MOCK_USERS.filter((u) => u.role === 'pro').length
  const nbProsEnAttente = MOCK_PRO_PROFILES.filter((p) => !p.verifie).length

  const nbAOs = aos.length
  const nbAOsActifs = aos.filter((a) => ['publie', 'en_cours'].includes(a.statut)).length

  const commissionsTotal = MOCK_OFFRES.filter((o) => o.statut === 'selectionnee')
    .reduce((s, o) => s + o.montant * 0.025, 0)

  return (
    <div className="max-w-5xl mx-auto fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-light/50 mb-1">
          Administration
        </p>
        <h1 className="font-syne font-extrabold text-2xl text-white">Vue globale VertiCall</h1>
      </div>

      {/* KPIs globaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Clients inscrits',   value: nbClients,                             icon: '🏛️', color: 'text-blue-300'   },
          { label: 'Pros inscrits',      value: nbPros,                                icon: '🌿', color: 'text-green-light' },
          { label: 'AO actifs',          value: nbAOsActifs,                           icon: '📋', color: 'text-yellow-300'  },
          { label: 'Commissions (2,5%)', value: formatMontant(Math.round(commissionsTotal)), icon: '💰', color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="bg-white/8 border border-white/8 backdrop-blur rounded-2xl p-5 text-center">
            <span className="text-2xl">{s.icon}</span>
            <div className={`font-syne font-extrabold text-3xl ${s.color} mt-2`}>{s.value}</div>
            <div className="text-xs text-white/40 font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Validation pros / liste pros */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Pros à valider */}
        <div>
          <h2 className="font-syne font-bold text-base text-white/80 mb-3">
            Pros à valider
            {nbProsEnAttente > 0 && (
              <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                {nbProsEnAttente}
              </span>
            )}
          </h2>
          {MOCK_PRO_PROFILES.filter((p) => !p.verifie).length === 0 ? (
            <div className="bg-white/6 border border-white/8 rounded-2xl p-6 text-center text-white/40 text-sm">
              Aucun pro en attente
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {MOCK_PRO_PROFILES.filter((p) => !p.verifie).map((profil) => {
                const u = MOCK_USERS.find((user) => user.id === profil.user_id)
                return (
                  <div key={profil.id} className="bg-white rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-syne font-bold text-green-dark text-sm truncate">
                          {profil.raison_sociale}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{u?.email}</div>
                        <div className="text-xs text-gray-400 capitalize mt-0.5">
                          {profil.metier} · Dép. {profil.departements.join(', ')}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button className="bg-green-mid text-white text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-green-dark transition-colors">
                          Valider
                        </button>
                        <button className="bg-red-50 text-red-500 text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                          Refuser
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tous les pros */}
        <div>
          <h2 className="font-syne font-bold text-base text-white/80 mb-3">
            Pros ({nbPros})
          </h2>
          <div className="flex flex-col gap-2">
            {MOCK_PRO_PROFILES.map((profil) => (
              <div key={profil.id} className="bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-syne font-bold text-green-dark text-sm">
                      {profil.raison_sociale}
                    </div>
                    <div className="text-xs text-gray-400 capitalize mt-0.5">{profil.metier}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs justify-end">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-green-dark">{profil.note_moyenne}</span>
                      </div>
                      <div className="text-xs text-gray-400">{profil.nb_contrats} contrats</div>
                    </div>
                    {profil.verifie ? (
                      <span className="text-xs bg-green-pale text-green-mid px-2 py-0.5 rounded-full font-semibold">✓</span>
                    ) : (
                      <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-semibold">⏳</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table AOs */}
      <h2 className="font-syne font-bold text-base text-white/80 mb-3">
        Appels d&apos;offres ({nbAOs})
      </h2>
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-pale/60 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Titre</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Client</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Offres</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {aos.map((ao) => (
              <tr key={ao.id} className="border-t border-gray-50 hover:bg-green-pale/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-green-dark truncate max-w-xs">{ao.titre}</div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ao.client_nom}</td>
                <td className="px-4 py-3">
                  <StatutAOBadge statut={ao.statut} />
                </td>
                <td className="px-4 py-3 text-green-mid font-semibold">{ao.nb_offres}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(ao.date_souhaitee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
