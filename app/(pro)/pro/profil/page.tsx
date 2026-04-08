'use client'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/store'
import { MOCK_PRO_PROFILES } from '@/lib/mock-data'
import type { ProProfile } from '@/types'
import Card from '@/components/ui/Card'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne font-bold text-2xl text-green-dark">Mon profil pro</h1>
        {profil?.verifie ? (
          <Badge variant="green">✓ Profil vérifié</Badge>
        ) : (
          <Badge variant="yellow">⚠ Vérification en attente</Badge>
        )}
      </div>

      {/* Note & stats */}
      {profil && (
        <Card className="mb-6 flex items-center gap-6">
          <div className="text-center">
            <div className="font-syne font-bold text-4xl text-green-mid">{profil.note_moyenne}</div>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(profil.note_moyenne) ? 'text-yellow-400 text-sm' : 'text-gray-200 text-sm'}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Note moyenne</div>
          </div>
          <div className="flex-1 flex gap-8">
            <div className="text-center">
              <div className="font-syne font-bold text-2xl text-green-dark">{profil.nb_contrats}</div>
              <div className="text-xs text-gray-400">Contrats réalisés</div>
            </div>
            <div className="text-center">
              <div className="font-syne font-bold text-2xl text-green-dark">{profil.departements.length}</div>
              <div className="text-xs text-gray-400">Départements</div>
            </div>
          </div>
        </Card>
      )}

      {/* Formulaire */}
      <Card>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Input
            id="raison_sociale"
            name="raison_sociale"
            label="Raison sociale"
            placeholder="Mon Entreprise SARL"
            value={form.raison_sociale}
            onChange={handleChange}
          />
          <Input
            id="siret"
            name="siret"
            label="SIRET"
            placeholder="12345678900001"
            value={form.siret}
            onChange={handleChange}
          />
          <Select
            id="metier"
            name="metier"
            label="Métier principal"
            options={METIERS}
            value={form.metier}
            onChange={handleChange}
          />
          <Textarea
            id="description"
            name="description"
            label="Présentation de votre activité"
            placeholder="Décrivez votre expérience, vos certifications, vos références..."
            rows={4}
            value={form.description}
            onChange={handleChange}
          />

          {/* Départements */}
          <div>
            <label className="text-sm font-medium text-green-dark block mb-2">
              Départements couverts
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPARTEMENTS.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => toggleDepartement(d.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    form.departements.includes(d.code)
                      ? 'bg-green-mid text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-pale'
                  }`}
                >
                  {d.code} {d.nom}
                </button>
              ))}
            </div>
          </div>

          {saved && (
            <div className="bg-green-pale text-green-mid text-sm px-4 py-2 rounded-lg">
              ✓ Profil sauvegardé avec succès
            </div>
          )}

          <Button type="submit">Sauvegarder les modifications</Button>
        </form>
      </Card>
    </div>
  )
}
