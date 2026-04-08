'use client'
import { useEffect, useState } from 'react'
import { getAllAOs } from '@/lib/store'
import { MOCK_USERS, MOCK_PRO_PROFILES, MOCK_OFFRES } from '@/lib/mock-data'
import type { AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import { StatutAOBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [aos, setAos] = useState<AppelOffre[]>([])

  useEffect(() => {
    setAos(getAllAOs())
  }, [])

  const nbClients = MOCK_USERS.filter((u) => u.role === 'client').length
  const nbPros = MOCK_USERS.filter((u) => u.role === 'pro').length
  const nbProsVerifies = MOCK_PRO_PROFILES.filter((p) => p.verifie).length
  const nbProsEnAttente = MOCK_PRO_PROFILES.filter((p) => !p.verifie).length

  const nbAOs = aos.length
  const nbAOsActifs = aos.filter((a) => ['publie', 'en_cours'].includes(a.statut)).length

  const commissionsTotal = MOCK_OFFRES.filter((o) => o.statut === 'selectionnee')
    .reduce((s, o) => s + o.montant * 0.025, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-syne font-bold text-2xl text-white mb-8">Vue globale VertiCall</h1>

      {/* KPIs globaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Clients inscrits', value: nbClients, icon: '🏛️', color: 'text-blue-300' },
          { label: 'Pros inscrits', value: nbPros, icon: '🌿', color: 'text-green-light' },
          { label: 'AO actifs', value: nbAOsActifs, icon: '📋', color: 'text-yellow-300' },
          { label: 'Commissions (2,5%)', value: formatMontant(Math.round(commissionsTotal)), icon: '💰', color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`font-syne font-bold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Validation pros en attente */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-syne font-bold text-lg text-white mb-4">
            Pros à valider ({nbProsEnAttente})
          </h2>
          {MOCK_PRO_PROFILES.filter((p) => !p.verifie).length === 0 ? (
            <div className="bg-white/10 rounded-xl p-6 text-center text-white/60 text-sm">
              Aucun pro en attente de validation.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {MOCK_PRO_PROFILES.filter((p) => !p.verifie).map((profil) => {
                const user = MOCK_USERS.find((u) => u.id === profil.user_id)
                return (
                  <div key={profil.id} className="bg-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-syne font-bold text-green-dark text-sm">
                          {profil.raison_sociale}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user?.email} · SIRET {profil.siret}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 capitalize">
                          {profil.metier} · Dép. {profil.departements.join(', ')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-mid text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-dark transition-colors">
                          Valider
                        </button>
                        <button className="bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition-colors">
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

        {/* Stats pros */}
        <div>
          <h2 className="font-syne font-bold text-lg text-white mb-4">Pros ({nbPros})</h2>
          <div className="flex flex-col gap-3">
            {MOCK_PRO_PROFILES.map((profil) => (
              <div key={profil.id} className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-syne font-bold text-green-dark text-sm">
                      {profil.raison_sociale}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{profil.metier}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{profil.note_moyenne}</span>
                      </div>
                      <div className="text-xs text-gray-400">{profil.nb_contrats} contrats</div>
                    </div>
                    {profil.verifie ? (
                      <span className="text-xs bg-green-pale text-green-mid px-2 py-0.5 rounded-full font-medium">✓ Vérifié</span>
                    ) : (
                      <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-medium">En attente</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tous les AOs */}
      <h2 className="font-syne font-bold text-lg text-white mb-4">
        Tous les appels d&apos;offres ({nbAOs})
      </h2>
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-pale text-left">
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Titre</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Client</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Offres</th>
              <th className="px-4 py-3 text-xs font-semibold text-green-dark uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {aos.map((ao) => (
              <tr key={ao.id} className="border-t border-green-pale/50 hover:bg-green-pale/20">
                <td className="px-4 py-3">
                  <div className="font-medium text-green-dark truncate max-w-xs">{ao.titre}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{ao.client_nom}</td>
                <td className="px-4 py-3">
                  <StatutAOBadge statut={ao.statut} />
                </td>
                <td className="px-4 py-3 text-green-mid font-medium">{ao.nb_offres}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {formatDate(ao.date_souhaitee)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
