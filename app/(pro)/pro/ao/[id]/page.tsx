'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAOById, getCurrentUser, createOffre, getOffresByPro } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { AppelOffre } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import { formatDate, formatMontant, CATEGORIES_LABELS } from '@/lib/utils'

export default function ProAODetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ao, setAO] = useState<AppelOffre | null>(null)
  const [dejaPostule, setDejaPostule] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ montant: '', delai: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const found = getAOById(id)
    if (!found) { router.push('/pro/ao'); return }
    setAO(found)
    const user = getCurrentUser()
    if (user) {
      const offres = getOffresByPro(user.id)
      setDejaPostule(offres.some((o) => o.ao_id === id))
    }
  }, [id, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.montant || !form.delai || !form.description) {
      setError('Tous les champs sont obligatoires.')
      return
    }
    setError('')
    setLoading(true)

    const user = getCurrentUser()
    if (!user) { router.push('/login'); return }
    const profil = MOCK_PRO_PROFILES.find((p) => p.user_id === user.id)

    createOffre({
      ao_id: id,
      pro_id: user.id,
      pro_nom: profil?.raison_sociale ?? `${user.prenom} ${user.nom}`,
      pro_metier: profil?.metier ?? 'Pro',
      pro_note: profil?.note_moyenne ?? 4.0,
      montant: Number(form.montant),
      delai: form.delai,
      description: form.description,
      statut: 'soumise',
    })

    router.push('/pro/offres')
  }

  if (!ao) return <div className="p-8 text-gray-400">Chargement…</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/pro/ao" className="hover:text-green-mid">Appels d&apos;offres</Link>
        {' / '}
        <span className="text-green-dark">{ao.titre}</span>
      </div>

      {/* Détail AO */}
      <Card className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">
              {CATEGORIES_LABELS[ao.categorie]} · Dép. {ao.departement}
            </div>
            <h1 className="font-syne font-bold text-xl text-green-dark">{ao.titre}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {ao.client_nom} — {ao.client_commune}
            </div>
          </div>
          <div className="text-right shrink-0">
            {ao.budget_max ? (
              <>
                <div className="font-syne font-bold text-xl text-green-mid">
                  max {formatMontant(ao.budget_max)}
                </div>
                {ao.budget_min && (
                  <div className="text-xs text-gray-400">min {formatMontant(ao.budget_min)}</div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400">Budget non communiqué</div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{ao.description}</p>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-400">Date souhaitée : </span>
            <span className="font-medium text-green-dark">{formatDate(ao.date_souhaitee)}</span>
          </div>
          <div>
            <span className="text-gray-400">Offres reçues : </span>
            <span className="font-medium text-green-mid">{ao.nb_offres}</span>
          </div>
        </div>
      </Card>

      {/* Zone soumission */}
      {dejaPostule ? (
        <Card className="text-center py-8">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-green-mid font-medium mb-1">Vous avez déjà soumis une offre</p>
          <Link href="/pro/offres" className="text-sm text-gray-500 hover:text-green-mid">
            Voir mes offres →
          </Link>
        </Card>
      ) : !showForm ? (
        <Card className="text-center py-8">
          <h2 className="font-syne font-bold text-lg text-green-dark mb-2">
            Soumettre une offre
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Proposez votre prix, votre délai et décrivez votre approche.
          </p>
          <Button onClick={() => setShowForm(true)}>Proposer mon offre</Button>
        </Card>
      ) : (
        <Card>
          <h2 className="font-syne font-bold text-lg text-green-dark mb-5">Votre offre</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="montant"
                name="montant"
                label="Montant proposé (€)"
                type="number"
                placeholder="8500"
                value={form.montant}
                onChange={handleChange}
                required
              />
              <Input
                id="delai"
                name="delai"
                label="Date de livraison proposée"
                type="date"
                value={form.delai}
                onChange={handleChange}
                required
              />
            </div>
            <Textarea
              id="description"
              name="description"
              label="Description de votre approche"
              placeholder="Décrivez votre méthode, le matériel utilisé, l'équipe mobilisée..."
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Envoi…' : 'Soumettre mon offre'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
