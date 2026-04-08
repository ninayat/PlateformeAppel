'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAOById, getOffresByAO, updateAOStatut } from '@/lib/store'
import type { AppelOffre, Offre } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatutAOBadge } from '@/components/ui/Badge'
import { formatDate, formatMontant, CATEGORIES_LABELS } from '@/lib/utils'

export default function AODetailClientPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ao, setAO] = useState<AppelOffre | null>(null)
  const [offres, setOffres] = useState<Offre[]>([])

  useEffect(() => {
    const found = getAOById(id)
    if (!found) { router.push('/client/dashboard'); return }
    setAO(found)
    setOffres(getOffresByAO(id))
  }, [id, router])

  function handleAnnuler() {
    updateAOStatut(id, 'annule')
    setAO((prev) => prev ? { ...prev, statut: 'annule' } : null)
  }

  if (!ao) return <div className="p-8 text-gray-400">Chargement…</div>

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/client/dashboard" className="hover:text-green-mid">Dashboard</Link>
        {' / '}
        <span className="text-green-dark">{ao.titre}</span>
      </div>

      {/* En-tête */}
      <Card className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatutAOBadge statut={ao.statut} />
              <span className="text-xs text-gray-400">{CATEGORIES_LABELS[ao.categorie]}</span>
            </div>
            <h1 className="font-syne font-bold text-xl text-green-dark">{ao.titre}</h1>
          </div>
          {ao.statut === 'publie' && (
            <Button variant="danger" size="sm" onClick={handleAnnuler}>
              Annuler l&apos;AO
            </Button>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4">{ao.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoBlock label="Département" value={ao.departement} />
          <InfoBlock label="Date souhaitée" value={formatDate(ao.date_souhaitee)} />
          {ao.budget_min && <InfoBlock label="Budget min" value={formatMontant(ao.budget_min)} />}
          {ao.budget_max && <InfoBlock label="Budget max" value={formatMontant(ao.budget_max)} />}
        </div>
      </Card>

      {/* Offres reçues */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-lg text-green-dark">
          Offres reçues ({offres.length})
        </h2>
        {offres.length >= 2 && (
          <Link href={`/client/ao/${id}/offres`}>
            <Button variant="outline" size="sm">Comparer les offres →</Button>
          </Link>
        )}
      </div>

      {offres.length === 0 ? (
        <Card className="text-center py-10">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-gray-500 text-sm">
            Aucune offre reçue pour l&apos;instant. Les pros de votre département ont été notifiés.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {offres.map((offre) => (
            <Card key={offre.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-syne font-bold text-green-dark">{offre.pro_nom}</div>
                  <div className="text-xs text-gray-400">{offre.pro_metier}</div>
                  <p className="text-sm text-gray-600 mt-2">{offre.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-syne font-bold text-xl text-green-mid">
                    {formatMontant(offre.montant)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Délai : {formatDate(offre.delai)}
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs font-medium">{offre.pro_note}/5</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-green-dark">{value}</div>
    </div>
  )
}
