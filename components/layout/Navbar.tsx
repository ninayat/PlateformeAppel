'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/store'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const router = useRouter()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const dashboardHref =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'pro'
      ? '/pro/dashboard'
      : '/client/dashboard'

  return (
    <nav className="bg-green-dark text-white px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-syne font-bold text-xl tracking-tight text-green-light">
        Verti<span className="text-white">Call</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href={dashboardHref} className="text-sm text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <span className="text-sm text-white/60">
              {user.prenom} · <span className="capitalize">{user.role}</span>
            </span>
            <Button size="sm" variant="outline" onClick={handleLogout}
              className="border-white/30 text-white hover:bg-white/10">
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-white/80 hover:text-white">
              Connexion
            </Link>
            <Link href="/register">
              <Button size="sm" variant="secondary">Créer un compte</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
