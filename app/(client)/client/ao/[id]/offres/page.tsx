'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAOById, getOffresByAO, selectionnerOffre } from '@/lib/store'
import { calculerScoreOffre } from '@/lib/score'
import type { AppelOffre, Offre } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatutOffreBadge } from '@/components/ui/Badge'
import ScoreBar, { ScoreCircle } from '@/components/ui/ScoreBar'
import Modal from '@/components/ui/Modal'
import { formatDate, formatMontant } from '@/lib/utils'

export default function ComparatifOffresPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ao, setAO] = useState<AppelOffre | null>(null)
  const [offres, setOffres] = useState<Offre[]>([])
  const [confirmOffre, setConfirmOffre] = useState<Offre | null>(null)

  useEffect(() => {
    const found = getAOById(id)
    if (!found) { router.push('/client/dashboard'); return }
    setAO(found)
    const raw = getOffresByAO(id)
    // Calcul du score pour chaque offre
    const withScores = raw.map((o) => ({
      ...o,
      score: calculerScoreOffre(o, found).score,
    }))
    // Tri par score décroissant
    setOffres(withScores.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)))
  }, [id, router])

  function handleSelectionner() {
    if (!confirmOffre) return
    selectionnerOffre(confirmOffre.id, id)
    setConfirmOffre(null)
    router.push(`/client/ao/${id}`)
  }

  if (!ao) return <div className="p-8 text-gray-400">Chargement…</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/client/dashboard" className="hover:text-green-mid">Dashboard</Link>
        {' / '}
        <Link href={`/client/ao/${id}`} className="hover:text-green-mid">{ao.titre}</Link>
        {' / '}
        <span className="text-green-dark">Comparatif offres</span>
      </div>

      <h1 className="font-syne font-bold text-2xl text-green-dark mb-2">
        Comparatif des offres
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {offres.length} offre{offres.length > 1 ? 's' : ''} — triées par score (note + délai + prix)
      </p>

      {/* Tableau comparatif */}
      <div className="flex flex-col gap-4">
        {offres.map((offre, idx) => {
          const detail = ao ? calculerScoreOffre(offre, ao).detail : null
          return (
            <Card
              key={offre.id}
              className={idx === 0 ? 'ring-2 ring-green-mid' : ''}
            >
              {idx === 0 && (
                <div className="text-xs font-bold text-green-mid mb-2">★ Meilleure offre</div>
              )}
              <div className="flex items-start gap-6">
                {/* Score */}
                <div className="shrink-0">
                  <ScoreCircle score={offre.score ?? 0} />
                </div>

                {/* Infos pro */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-syne font-bold text-green-dark">{offre.pro_nom}</span>
                    <StatutOffreBadge statut={offre.statut} />
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{offre.pro_metier}</div>
                  <p className="text-sm text-gray-600">{offre.description}</p>

                  {/* Barres de détail */}
                  {detail && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      <ScoreDetail label="Note pro" score={detail.note} max={40} />
                      <ScoreDetail label="Délai" score={detail.delai} max={30} />
                      <ScoreDetail label="Prix" score={detail.prix} max={30} />
                    </div>
                  )}
                </div>

                {/* Prix & actions */}
                <div className="shrink-0 text-right flex flex-col gap-2">
                  <div className="font-syne font-bold text-2xl text-green-mid">
                    {formatMontant(offre.montant)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Délai : {formatDate(offre.delai)}
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs font-medium">{offre.pro_note}/5</span>
                  </div>
                  {ao.statut !== 'termine' && offre.statut === 'soumise' && (
                    <Button
                      size="sm"
                      variant={idx === 0 ? 'primary' : 'outline'}
                      onClick={() => setConfirmOffre(offre)}
                    >
                      Sélectionner
                    </Button>
                  )}
                  {offre.statut === 'selectionnee' && (
                    <span className="text-xs font-bold text-green-mid">✓ Sélectionnée</span>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Modal confirmation */}
      <Modal
        open={!!confirmOffre}
        onClose={() => setConfirmOffre(null)}
        title="Confirmer la sélection"
      >
        <p className="text-gray-600 mb-4">
          Vous êtes sur le point de sélectionner l&apos;offre de{' '}
          <strong>{confirmOffre?.pro_nom}</strong> pour{' '}
          <strong>{confirmOffre ? formatMontant(confirmOffre.montant) : ''}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Les autres offres seront automatiquement refusées et l&apos;AO sera marqué comme terminé.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setConfirmOffre(null)}>Annuler</Button>
          <Button onClick={handleSelectionner}>Confirmer la sélection</Button>
        </div>
      </Modal>
    </div>
  )
}

function ScoreDetail({ label, score, max }: { label: string; score: number; max: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-16 text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 bg-green-light rounded-full"
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-600">{score}/{max}</span>
    </div>
  )
}
