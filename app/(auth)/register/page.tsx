'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'client' | 'pro' | ''>('')
  const [form, setForm] = useState({ email: '', prenom: '', nom: '', commune: '', telephone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!role) { setError('Veuillez choisir un rôle.'); return }
    setError(''); setLoading(true)
    const user = register({ email: form.email, prenom: form.prenom, nom: form.nom, role, commune: form.commune, telephone: form.telephone })
    if (user.role === 'pro') router.push('/pro/dashboard')
    else router.push('/client/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#111a14] flex items-center justify-center p-6">
      <div className="w-full max-w-md fade-up">

        <div className="text-center mb-10">
          <Link href="/" className="font-syne font-extrabold text-2xl text-white inline-block">
            Verti<span className="text-green-light">Call</span>
          </Link>
          <h1 className="font-syne font-bold text-2xl text-white mt-6 mb-1">Créer un compte</h1>
          <p className="text-white/40 text-sm">Rejoignez la plateforme espaces verts B2B.</p>
        </div>

        {/* Choix du rôle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { r: 'client', icon: '🏛️', title: 'Client', sub: 'Mairie, syndic, collectivité' },
            { r: 'pro', icon: '🌿', title: 'Professionnel', sub: 'Élagueur, paysagiste…' },
          ] as const).map(({ r, icon, title, sub }) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={cn(
                'p-4 rounded-2xl border-2 text-left transition-all duration-200',
                role === r
                  ? 'border-green-light bg-green-light/10 text-white'
                  : 'border-white/10 bg-white/4 text-white/60 hover:border-white/20 hover:bg-white/6'
              )}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-syne font-bold text-sm">{title}</div>
              <div className="text-xs opacity-60 mt-0.5">{sub}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'prenom', label: 'Prénom', placeholder: 'Marie' },
              { name: 'nom', label: 'Nom', placeholder: 'Dupont' },
            ].map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">{f.label}</label>
                <input name={f.name} placeholder={f.placeholder} value={(form as any)[f.name]}
                  onChange={handleChange} required
                  className="input-base bg-white/6 border-white/10 text-white placeholder:text-white/25
                    focus:ring-green-light/30 focus:border-green-light/50" />
              </div>
            ))}
          </div>

          {[
            { name: 'email', type: 'email', label: 'Email', placeholder: 'contact@organisation.fr' },
            { name: 'commune', type: 'text', label: 'Commune', placeholder: 'Lyon' },
            { name: 'telephone', type: 'tel', label: 'Téléphone', placeholder: '0600000000' },
            { name: 'password', type: 'password', label: 'Mot de passe', placeholder: '••••••••' },
          ].map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} value={(form as any)[f.name]}
                onChange={handleChange} required={f.name !== 'commune' && f.name !== 'telephone'}
                className="input-base bg-white/6 border-white/10 text-white placeholder:text-white/25
                  focus:ring-green-light/30 focus:border-green-light/50" />
            </div>
          ))}

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="mt-2 w-full bg-green-light text-green-dark font-semibold py-3 rounded-xl
              hover:bg-green-light/90 transition-all hover:shadow-lg hover:shadow-green-light/20
              disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-green-light hover:text-green-light/80 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
