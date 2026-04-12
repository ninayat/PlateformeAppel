'use client'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { ProProfile } from '@/types'
import Button from '@/components/ui/Button'
import { DEPARTEMENTS } from '@/lib/utils'

const METIERS = [
  { value: 'elagueur', label: 'Élagueur / Arboriste' },
  { value: 'paysagiste', label: 'Paysagiste' },
  { value: 'entretien', label: 'Entretien espaces verts' },
  { value: 'autre', label: 'Autre' },
]

export default function ProfilPage() {
  const [profil, setProfil] = useState<ProProfile | null>(null)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    raison_sociale: '',
    siret: '',
    metier: '',
    description: '',
    departements: [] as string[],
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    const found = MOCK_PRO_PROFILES.find((p) => p.user_id === user.id)
    if (found) {
      setProfil(found)
      setForm({
        raison_sociale: found.raison_sociale,
        siret: found.siret,
        metier: found.metier,
        description: found.description,
        departements: found.departements,
      })
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function toggleDepartement(code: string) {
    setForm((f) => ({
      ...f,
      departements: f.departements.includes(code)
        ? f.departements.filter((d) => d !== code)
        : [...f.departements, code],
    }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // Simulation de sauvegarde (localStorage en prod)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-mid/60 mb-1">
            Compte professionnel
          </p>
          <h1 className="font-syne font-extrabold text-2xl text-green-dark">Mon profil pro</h1>
        </div>
        {profil?.verifie ? (
          <span className="text-xs bg-green-pale text-green-mid font-semibold px-3 py-1 rounded-full">
            ✓ Profil vérifié
          </span>
        ) : (
          <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-3 py-1 rounded-full">
            ⚠ Vérification en attente
          </span>
        )}
      </div>

      {/* Note & stats */}
      {profil && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card mb-6 flex items-center gap-6">
          <div className="text-center shrink-0">
            <div className="font-syne font-extrabold text-4xl text-green-mid">{profil.note_moyenne}</div>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(profil.note_moyenne) ? 'text-yellow-400 text-sm' : 'text-gray-200 text-sm'}>★</span>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Note moyenne</div>
          </div>
          <div className="flex-1 border-l border-gray-100 pl-6 flex gap-8">
            <div className="text-center">
              <div className="font-syne font-extrabold text-2xl text-green-dark">{profil.nb_contrats}</div>
              <div className="text-xs text-gray-400">Contrats</div>
            </div>
            <div className="text-center">
              <div className="font-syne font-extrabold text-2xl text-green-dark">{profil.departements.length}</div>
              <div className="text-xs text-gray-400">Départements</div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className="section-label" htmlFor="raison_sociale">Raison sociale</label>
            <input
              id="raison_sociale"
              name="raison_sociale"
              className="input-base"
              placeholder="Mon Entreprise SARL"
              value={form.raison_sociale}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="section-label" htmlFor="siret">SIRET</label>
            <input
              id="siret"
              name="siret"
              className="input-base"
              placeholder="12345678900001"
              value={form.siret}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="section-label" htmlFor="metier">Métier principal</label>
            <select
              id="metier"
              name="metier"
              className="input-base"
              value={form.metier}
              onChange={handleChange}
            >
              <option value="">Sélectionner...</option>
              {METIERS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="section-label" htmlFor="description">Présentation de votre activité</label>
            <textarea
              id="description"
              name="description"
              className="input-base resize-none"
              placeholder="Décrivez votre expérience, vos certifications, vos références..."
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Départements */}
          <div>
            <label className="section-label">Départements couverts</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DEPARTEMENTS.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => toggleDepartement(d.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    form.departements.includes(d.code)
                      ? 'bg-green-mid text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-green-pale hover:text-green-mid'
                  }`}
                >
                  {d.code} {d.nom}
                </button>
              ))}
            </div>
          </div>

          {saved && (
            <div className="bg-green-pale text-green-mid text-sm px-4 py-3 rounded-xl font-medium">
              ✓ Profil sauvegardé avec succès
            </div>
          )}

          <Button type="submit">Sauvegarder les modifications</Button>
        </form>
      </div>
    </div>
  )
}
