'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/store'

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
    if (user.role === 'admin') router.push('/admin')
    else if (user.role === 'pro') router.push('/pro/dashboard')
    else router.push('/client/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#111a14] flex">

      {/* ── Colonne gauche décorative ── */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-green-mid/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

        <Link href="/" className="relative font-syne font-extrabold text-2xl text-white">
          Verti<span className="text-green-light">Call</span>
        </Link>

        <div className="relative">
          <blockquote className="font-syne text-3xl font-bold text-white leading-tight mb-6">
            &ldquo;La plateforme qui connecte le végétal et les collectivités.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-4">
            {[
              { icon: '🌳', text: 'Élagueurs certifiés' },
              { icon: '🌿', text: 'Paysagistes qualifiés' },
              { icon: '✂️', text: 'Entretien espaces verts' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/60 text-sm">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/25 text-xs">
          © {new Date().getFullYear()} VertiCall — Plateforme B2B Espaces Verts
        </p>
      </div>

      {/* ── Colonne droite : formulaire ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm fade-up">

          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="font-syne font-extrabold text-2xl text-white">
              Verti<span className="text-green-light">Call</span>
            </Link>
          </div>

          <h1 className="font-syne font-bold text-2xl text-white mb-1">Bon retour !</h1>
          <p className="text-white/40 text-sm mb-8">Connectez-vous à votre espace.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@mairie.fr"
                className="input-base bg-white/6 border-white/10 text-white placeholder:text-white/25
                  focus:ring-green-light/30 focus:border-green-light/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">Mot de passe</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base bg-white/6 border-white/10 text-white placeholder:text-white/25
                  focus:ring-green-light/30 focus:border-green-light/50"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-green-light text-green-dark font-semibold py-3 rounded-xl
                hover:bg-green-light/90 transition-all hover:shadow-lg hover:shadow-green-light/20
                disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          {/* Comptes demo */}
          <div className="mt-8 border-t border-white/8 pt-6">
            <p className="text-xs text-white/30 mb-3 uppercase tracking-wide font-semibold">Comptes de démo</p>
            <div className="flex flex-col gap-1.5">
              {[
                { role: 'Client', email: 'mairie.lyon@test.fr', icon: '🏛️' },
                { role: 'Pro', email: 'arbre.expert@test.fr', icon: '🌿' },
                { role: 'Admin', email: 'admin@verticall.fr', icon: '⚙️' },
              ].map((acc) => (
                <button key={acc.email} onClick={() => setEmail(acc.email)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-left
                    hover:bg-white/5 transition-colors group">
                  <span className="text-base">{acc.icon}</span>
                  <div>
                    <span className="text-xs font-semibold text-white/50 group-hover:text-white/70 transition-colors">
                      {acc.role}
                    </span>
                    <span className="text-xs text-white/30 ml-2">{acc.email}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-white/30 mt-6">
            Pas de compte ?{' '}
            <Link href="/register" className="text-green-light hover:text-green-light/80 font-medium">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
