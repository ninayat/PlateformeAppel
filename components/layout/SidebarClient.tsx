'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/store'

const links = [
  { href: '/client/dashboard', label: 'Tableau de bord', icon: '⊞' },
  { href: '/client/ao/new',    label: 'Publier un AO',   icon: '+' },
  { href: '/client/messages',  label: 'Messages',        icon: '◎' },
]

export default function SidebarClient() {
  const pathname = usePathname()
  const user = getCurrentUser()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
      {/* User block */}
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
              <div className="text-xs text-gray-400 truncate">{user.commune}</div>
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
                active ? 'bg-green-mid text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-green-pale'
              )}>
                {l.icon}
              </span>
              <span className="text-sm">{l.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link href="/questionnaire"
          className="block w-full text-center text-xs font-semibold text-green-mid
            bg-green-pale/60 hover:bg-green-pale px-3 py-2 rounded-xl transition-colors">
          Évaluer mon projet →
        </Link>
      </div>
    </aside>
  )
}
