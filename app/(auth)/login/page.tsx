'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/store'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const user = login(email, password)
    if (!user) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    // Redirection selon le rôle
    if (user.role === 'admin') router.push('/admin')
    else if (user.role === 'pro') router.push('/pro/dashboard')
    else router.push('/client/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-bold text-3xl text-green-dark">
            Verti<span className="text-green-mid">Call</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Plateforme espaces verts B2B</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-pale p-8">
          <h2 className="font-syne font-bold text-xl text-green-dark mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>

          {/* Comptes de test */}
          <div className="mt-6 border-t border-green-pale pt-4">
            <p className="text-xs text-gray-400 mb-2">Comptes de test (sans mdp) :</p>
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <button className="text-left hover:text-green-mid" onClick={() => setEmail('mairie.lyon@test.fr')}>
                Client : mairie.lyon@test.fr
              </button>
              <button className="text-left hover:text-green-mid" onClick={() => setEmail('arbre.expert@test.fr')}>
                Pro : arbre.expert@test.fr
              </button>
              <button className="text-left hover:text-green-mid" onClick={() => setEmail('admin@verticall.fr')}>
                Admin : admin@verticall.fr
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-green-mid hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
