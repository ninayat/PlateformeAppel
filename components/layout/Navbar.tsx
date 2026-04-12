'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/store'

const ROLE_LABELS: Record<string, string> = { client: 'Client', pro: 'Pro', admin: 'Admin' }
const ROLE_COLORS: Record<string, string> = {
  client: 'bg-blue-500/15 text-blue-300',
  pro: 'bg-green-light/15 text-green-light',
  admin: 'bg-accent/15 text-accent',
}

export default function Navbar() {
  const router = useRouter()
  const user = getCurrentUser()

  const dashboardHref =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'pro'   ? '/pro/dashboard' : '/client/dashboard'

  function handleLogout() { logout(); router.push('/login') }

  return (
    <header className="h-14 bg-white/95 backdrop-blur-sm border-b border-gray-100
      flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">

      <Link href="/" className="font-syne font-extrabold text-lg text-green-dark tracking-tight">
        Verti<span className="text-green-mid">Call</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-pale flex items-center justify-center
              font-syne font-bold text-xs text-green-mid">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <span className="text-sm font-medium text-green-dark hidden sm:block">
              {user.prenom}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold hidden sm:inline-flex
              ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-500'}`}>
              {ROLE_LABELS[user.role]}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <button onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium">
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-green-mid transition-colors">
            Connexion
          </Link>
          <Link href="/register"
            className="text-sm font-semibold bg-green-mid text-white px-4 py-1.5 rounded-xl
              hover:bg-green-dark transition-colors shadow-sm">
            Créer un compte
          </Link>
        </div>
      )}
    </header>
  )
}
