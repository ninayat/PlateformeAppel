'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllAOs, getCurrentUser } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { AppelOffre } from '@/types'
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
    <div className="max-w-4xl mx-auto fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-mid/60 mb-1">
          Appels d&apos;offres
        </p>
        <h1 className="font-syne font-extrabold text-2xl text-green-dark">
          Missions disponibles
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {aosFiltrés.length} AO correspondent à vos critères
        </p>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <input
          className="input-base"
          placeholder="Rechercher un AO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-base"
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          <option value="elagage">Élagage</option>
          <option value="paysagisme">Paysagisme</option>
          <option value="entretien">Entretien</option>
          <option value="creation">Création</option>
          <option value="autre">Autre</option>
        </select>
        <select
          className="input-base"
          value={filtreDep}
          onChange={(e) => setFiltreDep(e.target.value)}
        >
          <option value="">Tous départements</option>
          {DEPARTEMENTS.map((d) => (
            <option key={d.code} value={d.code}>{d.code} — {d.nom}</option>
          ))}
        </select>
      </div>

      {/* Liste */}
      {aosFiltrés.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-syne font-bold text-green-dark mb-2">Aucun résultat</h3>
          <p className="text-gray-400 text-sm">Aucun AO ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {aosFiltrés.map((ao) => (
            <Link key={ao.id} href={`/pro/ao/${ao.id}`}>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card
                hover:shadow-card-hover hover:border-green-light/30 hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-green-pale text-green-mid px-2 py-0.5 rounded-full">
                        {CATEGORIES_LABELS[ao.categorie]}
                      </span>
                      <span className="text-xs text-gray-400">Dép. {ao.departement}</span>
                    </div>
                    <h3 className="font-syne font-bold text-green-dark text-base">{ao.titre}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{ao.description}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      Par <span className="font-medium text-gray-600">{ao.client_nom}</span> — {ao.client_commune}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col gap-1">
                    <div className="font-syne font-bold text-green-mid text-sm">
                      {ao.nb_offres} offre{ao.nb_offres !== 1 ? 's' : ''}
                    </div>
                    {ao.budget_max ? (
                      <div className="text-xs text-gray-400">max {formatMontant(ao.budget_max)}</div>
                    ) : (
                      <div className="text-xs text-gray-300">Budget nc.</div>
                    )}
                    <div className="text-xs text-orange-500 font-medium mt-1">
                      ↯ {formatDate(ao.date_souhaitee)}
                    </div>
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
