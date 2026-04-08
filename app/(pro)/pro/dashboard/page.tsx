'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentUser, getOffresByPro, getAllAOs } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { Offre, AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import { StatutOffreBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant } from '@/lib/utils'

export default function ProDashboardPage() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [aos, setAos] = useState<AppelOffre[]>([])
  const user = typeof window !== 'undefined' ? getCurrentUser() : null

  useEffect(() => {
    const u = getCurrentUser()
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-green-dark">
            Bonjour {user?.prenom} 👋
          </h1>
          {profil && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">{profil.raison_sociale}</span>
              {profil.verifie ? (
                <span className="text-xs text-green-mid font-medium">✓ Profil vérifié</span>
              ) : (
                <span className="text-xs text-orange-600 font-medium">⚠ Vérification en attente</span>
              )}
            </div>
          )}
        </div>
        <Link href="/pro/ao" className="text-sm text-green-mid hover:underline font-medium">
          Voir les AO disponibles →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'AO disponibles', value: stats.aoDispos, color: 'text-blue-600', icon: '📋' },
          { label: 'Offres soumises', value: stats.offresEnCours, color: 'text-green-mid', icon: '📤' },
          { label: 'Contrats signés', value: stats.selectionnees, color: 'text-accent-dark', icon: '✅' },
          { label: 'Commission due (2,5%)', value: `${formatMontant(stats.commission)}`, color: 'text-green-dark', icon: '💰' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`font-syne font-bold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Note moyenne */}
      {profil && (
        <Card className="mb-6 flex items-center gap-6">
          <div className="text-center">
            <div className="font-syne font-bold text-4xl text-green-mid">{profil.note_moyenne}</div>
            <div className="text-xs text-gray-400">Note moyenne</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(profil.note_moyenne) ? 'text-yellow-400' : 'text-gray-200'}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">{profil.nb_contrats} contrats réalisés</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Dép. couverts : {profil.departements.join(', ')}
            </div>
          </div>
        </Card>
      )}

      {/* Mes dernières offres */}
      <h2 className="font-syne font-bold text-lg text-green-dark mb-4">Mes dernières offres</h2>
      {offres.length === 0 ? (
        <Card className="text-center py-10">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-gray-500 text-sm mb-3">Aucune offre soumise pour l&apos;instant.</p>
          <Link href="/pro/ao" className="text-green-mid text-sm hover:underline">
            Parcourir les appels d&apos;offres →
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {offres.slice(0, 5).map((offre) => (
            <Card key={offre.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-green-dark">AO #{offre.ao_id}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{offre.description.slice(0, 60)}…</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-syne font-bold text-green-mid">{formatMontant(offre.montant)}</div>
                    <div className="text-xs text-gray-400">Délai : {formatDate(offre.delai)}</div>
                  </div>
                  <StatutOffreBadge statut={offre.statut} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
