'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/store'

const links = [
  { href: '/pro/dashboard', label: 'Tableau de bord', icon: '⊞' },
  { href: '/pro/ao',        label: 'Appels d\'offres', icon: '◈' },
  { href: '/pro/offres',    label: 'Mes offres',       icon: '◇' },
  { href: '/pro/messages',  label: 'Messages',         icon: '◎' },
  { href: '/pro/profil',    label: 'Mon profil',       icon: '◉' },
]

export default function SidebarPro() {
  const pathname = usePathname()
  const user = getCurrentUser()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
      {user && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-pale flex items-center justify-center
              font-syne font-extrabold text-sm text-green-mid">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-green-dark truncate">
                {user.prenom} {user.nom}
              </div>
              <div className="text-xs text-green-mid/70 font-medium">Professionnel</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 px-3 py-2">
          Navigation
        </span>
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/')
          return (
            <Link key={l.href} href={l.href}
              className={cn('sidebar-link', active ? 'sidebar-link-active' : 'sidebar-link-idle')}>
              <span className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors',
                active ? 'bg-green-mid text-white' : 'bg-gray-100 text-gray-400'
              )}>
                {l.icon}
              </span>
              <span className="text-sm">{l.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
