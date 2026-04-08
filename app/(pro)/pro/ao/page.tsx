'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllAOs, getCurrentUser } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { formatDate, formatMontant, CATEGORIES_LABELS, DEPARTEMENTS } from '@/lib/utils'

export default function ProAOListPage() {
  const [aos, setAos] = useState<AppelOffre[]>([])
  const [filtreCategorie, setFiltreCategorie] = useState('')
  const [filtreDep, setFiltreDep] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    const profil = MOCK_PRO_PROFILES.find((p) => p.user_id === user?.id)
    const all = getAllAOs().filter((ao) => ao.statut === 'publie')
    // Pré-filtrer par département du pro si disponible
    if (profil?.departements?.length) {
      setFiltreDep(profil.departements[0])
    }
    setAos(all)
  }, [])

  const aosFiltrés = aos.filter((ao) => {
    if (filtreCategorie && ao.categorie !== filtreCategorie) return false
    if (filtreDep && ao.departement !== filtreDep) return false
    if (search && !ao.titre.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne font-bold text-2xl text-green-dark mb-2">
        Appels d&apos;offres disponibles
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {aosFiltrés.length} AO correspondent à vos critères
      </p>

      {/* Filtres */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Input
          id="search"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          id="categorie"
          options={[
            { value: 'elagage', label: 'Élagage' },
            { value: 'paysagisme', label: 'Paysagisme' },
            { value: 'entretien', label: 'Entretien' },
            { value: 'creation', label: 'Création' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
        />
        <Select
          id="departement"
          options={DEPARTEMENTS.map((d) => ({ value: d.code, label: `${d.code} — ${d.nom}` }))}
          value={filtreDep}
          onChange={(e) => setFiltreDep(e.target.value)}
        />
      </div>

      {/* Liste */}
      {aosFiltrés.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">Aucun AO ne correspond à vos critères.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {aosFiltrés.map((ao) => (
            <Link key={ao.id} href={`/pro/ao/${ao.id}`}>
              <Card hoverable>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="green">{CATEGORIES_LABELS[ao.categorie]}</Badge>
                      <span className="text-xs text-gray-400">Dép. {ao.departement}</span>
                    </div>
                    <h3 className="font-syne font-bold text-green-dark text-base">{ao.titre}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ao.description}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      Publié par <strong>{ao.client_nom}</strong> — {ao.client_commune}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col gap-1">
                    <div className="text-sm font-bold text-green-mid">
                      {ao.nb_offres} offre{ao.nb_offres !== 1 ? 's' : ''}
                    </div>
                    {ao.budget_max ? (
                      <div className="text-sm text-gray-600">
                        max {formatMontant(ao.budget_max)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Budget nc.</div>
                    )}
                    <div className="text-xs text-orange-600 font-medium">
                      Avant le {formatDate(ao.date_souhaitee)}
                    </div>
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
