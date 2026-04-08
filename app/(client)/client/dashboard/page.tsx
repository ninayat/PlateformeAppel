'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllAOs, getCurrentUser } from '@/lib/store'
import type { AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatutAOBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant, CATEGORIES_LABELS } from '@/lib/utils'

export default function ClientDashboardPage() {
  const [aos, setAos] = useState<AppelOffre[]>([])
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const all = getAllAOs().filter((ao) => ao.client_id === u.id)
      setAos(all)
    }
  }, [])

  const stats = {
    total: aos.length,
    publie: aos.filter((a) => a.statut === 'publie').length,
    en_cours: aos.filter((a) => a.statut === 'en_cours').length,
    termine: aos.filter((a) => a.statut === 'termine').length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-green-dark">
            Bonjour {user?.prenom} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.commune}</p>
        </div>
        <Link href="/client/ao/new">
          <Button>+ Publier un AO</Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total AO', value: stats.total, color: 'text-green-dark' },
          { label: 'Publiés', value: stats.publie, color: 'text-green-mid' },
          { label: 'En cours', value: stats.en_cours, color: 'text-blue-600' },
          { label: 'Terminés', value: stats.termine, color: 'text-accent-dark' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <div className={`font-syne font-bold text-3xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Liste AOs */}
      <h2 className="font-syne font-bold text-lg text-green-dark mb-4">Mes appels d&apos;offres</h2>

      {aos.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 mb-4">Aucun appel d&apos;offres publié pour l&apos;instant.</p>
          <Link href="/client/ao/new">
            <Button>Publier mon premier AO</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {aos.map((ao) => (
            <Link key={ao.id} href={`/client/ao/${ao.id}`}>
              <Card hoverable>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatutAOBadge statut={ao.statut} />
                      <span className="text-xs text-gray-400">{CATEGORIES_LABELS[ao.categorie]}</span>
                    </div>
                    <h3 className="font-syne font-bold text-green-dark text-base truncate">
                      {ao.titre}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ao.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-green-mid">
                      {ao.nb_offres} offre{ao.nb_offres !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Avant le {formatDate(ao.date_souhaitee)}
                    </div>
                    {ao.budget_max && (
                      <div className="text-xs text-gray-400">
                        Budget max : {formatMontant(ao.budget_max)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
