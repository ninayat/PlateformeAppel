'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/store'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'client' | 'pro' | ''>('')
  const [form, setForm] = useState({
    email: '',
    prenom: '',
    nom: '',
    commune: '',
    telephone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role) {
      setError('Veuillez choisir un rôle.')
      return
    }
    setError('')
    setLoading(true)

    const user = register({
      email: form.email,
      prenom: form.prenom,
      nom: form.nom,
      role,
      commune: form.commune,
      telephone: form.telephone,
    })

    if (user.role === 'pro') router.push('/pro/dashboard')
    else router.push('/client/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-syne font-bold text-3xl text-green-dark">
            Verti<span className="text-green-mid">Call</span>
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-pale p-8">
          <h2 className="font-syne font-bold text-xl text-green-dark mb-6">Créer un compte</h2>

          {/* Choix du rôle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['client', 'pro'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  role === r
                    ? 'border-green-mid bg-green-pale'
                    : 'border-gray-200 hover:border-green-light/50'
                )}
              >
                <div className="text-2xl mb-1">{r === 'client' ? '🏛️' : '🌿'}</div>
                <div className="font-syne font-bold text-sm text-green-dark capitalize">{r}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {r === 'client'
                    ? 'Mairie, syndic, collectivité'
                    : 'Élagueur, paysagiste, entretien'}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="prenom"
                name="prenom"
                label="Prénom"
                placeholder="Marie"
                value={form.prenom}
                onChange={handleChange}
                required
              />
              <Input
                id="nom"
                name="nom"
                label="Nom"
                placeholder="Dupont"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="contact@organisation.fr"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              id="commune"
              name="commune"
              label="Commune"
              placeholder="Lyon"
              value={form.commune}
              onChange={handleChange}
            />
            <Input
              id="telephone"
              name="telephone"
              label="Téléphone"
              type="tel"
              placeholder="0600000000"
              value={form.telephone}
              onChange={handleChange}
            />
            <Input
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              {loading ? 'Création…' : 'Créer mon compte'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-green-mid hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
