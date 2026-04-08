'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createAO } from '@/lib/store'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { DEPARTEMENTS } from '@/lib/utils'

const ETAPES = ['Informations', 'Budget & délai', 'Validation']

const CATEGORIES = [
  { value: 'elagage', label: 'Élagage / Abattage' },
  { value: 'paysagisme', label: 'Paysagisme' },
  { value: 'entretien', label: 'Entretien régulier' },
  { value: 'creation', label: 'Création / Aménagement' },
  { value: 'autre', label: 'Autre' },
]

export default function NewAOPage() {
  const router = useRouter()
  const [etape, setEtape] = useState(0)
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: '',
    departement: '',
    budget_min: '',
    budget_max: '',
    date_souhaitee: '',
    statut: 'publie' as const,
  })
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validerEtape() {
    if (etape === 0) {
      if (!form.titre || !form.description || !form.categorie || !form.departement) {
        setError('Tous les champs sont obligatoires.')
        return
      }
    }
    if (etape === 1) {
      if (!form.date_souhaitee) {
        setError('La date souhaitée est obligatoire.')
        return
      }
    }
    setError('')
    setEtape((e) => e + 1)
  }

  function handleSubmit() {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    createAO({
      client_id: user.id,
      client_nom: `${user.prenom} ${user.nom}`,
      client_commune: user.commune ?? '',
      titre: form.titre,
      description: form.description,
      categorie: form.categorie as AppelOffreCategorie,
      departement: form.departement,
      budget_min: form.budget_min ? Number(form.budget_min) : undefined,
      budget_max: form.budget_max ? Number(form.budget_max) : undefined,
      date_souhaitee: form.date_souhaitee,
      statut: 'publie',
    })

    router.push('/client/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-green-dark">Publier un appel d&apos;offres</h1>
        <p className="text-gray-500 text-sm mt-1">Visible instantanément par les pros de votre département.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {ETAPES.map((e, i) => (
          <div key={e} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              i <= etape ? 'bg-green-mid text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i === etape ? 'font-medium text-green-dark' : 'text-gray-400'}`}>
              {e}
            </span>
            {i < ETAPES.length - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <Card>
        {/* Étape 1 */}
        {etape === 0 && (
          <div className="flex flex-col gap-5">
            <Input
              id="titre"
              name="titre"
              label="Titre de l'appel d'offres"
              placeholder="Ex : Élagage parc municipal — Printemps 2024"
              value={form.titre}
              onChange={handleChange}
              required
            />
            <Textarea
              id="description"
              name="description"
              label="Description détaillée"
              placeholder="Décrivez précisément la prestation attendue, les contraintes d'accès, le volume de travail..."
              rows={5}
              value={form.description}
              onChange={handleChange}
              required
            />
            <Select
              id="categorie"
              name="categorie"
              label="Catégorie"
              options={CATEGORIES}
              value={form.categorie}
              onChange={handleChange}
            />
            <Select
              id="departement"
              name="departement"
              label="Département"
              options={DEPARTEMENTS.map((d) => ({ value: d.code, label: `${d.code} — ${d.nom}` }))}
              value={form.departement}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Étape 2 */}
        {etape === 1 && (
          <div className="flex flex-col gap-5">
            <Input
              id="date_souhaitee"
              name="date_souhaitee"
              label="Date de réalisation souhaitée"
              type="date"
              value={form.date_souhaitee}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="budget_min"
                name="budget_min"
                label="Budget min (€) — optionnel"
                type="number"
                placeholder="5000"
                value={form.budget_min}
                onChange={handleChange}
              />
              <Input
                id="budget_max"
                name="budget_max"
                label="Budget max (€) — optionnel"
                type="number"
                placeholder="10000"
                value={form.budget_max}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-3">
              {(['publie', 'brouillon'] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statut"
                    value={s}
                    checked={form.statut === s}
                    onChange={handleChange}
                    className="accent-green-mid"
                  />
                  <span className="text-sm capitalize">
                    {s === 'publie' ? 'Publier immédiatement' : 'Sauvegarder en brouillon'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3 — Récapitulatif */}
        {etape === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="font-syne font-bold text-green-dark">Récapitulatif</h3>
            <div className="bg-green-pale/40 rounded-xl p-4 flex flex-col gap-2 text-sm">
              <Row label="Titre" value={form.titre} />
              <Row label="Catégorie" value={form.categorie} />
              <Row label="Département" value={form.departement} />
              <Row label="Date souhaitée" value={form.date_souhaitee} />
              {form.budget_min && <Row label="Budget min" value={`${form.budget_min} €`} />}
              {form.budget_max && <Row label="Budget max" value={`${form.budget_max} €`} />}
              <Row label="Statut" value={form.statut} />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-green-pale">
          {etape > 0 ? (
            <Button variant="ghost" onClick={() => setEtape((e) => e - 1)}>
              ← Retour
            </Button>
          ) : (
            <div />
          )}
          {etape < ETAPES.length - 1 ? (
            <Button onClick={validerEtape}>Suivant →</Button>
          ) : (
            <Button onClick={handleSubmit}>
              {form.statut === 'publie' ? 'Publier l\'AO' : 'Sauvegarder le brouillon'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-green-dark">{value}</span>
    </div>
  )
}

// Import local pour éviter l'import circulaire
type AppelOffreCategorie = 'elagage' | 'paysagisme' | 'entretien' | 'creation' | 'autre'
