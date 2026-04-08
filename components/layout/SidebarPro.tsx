'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/pro/dashboard', label: 'Tableau de bord', icon: '🏠' },
  { href: '/pro/ao', label: 'Appels d\'offres', icon: '📋' },
  { href: '/pro/offres', label: 'Mes offres', icon: '📄' },
  { href: '/pro/messages', label: 'Messages', icon: '💬' },
  { href: '/pro/profil', label: 'Mon profil', icon: '👤' },
]

export default function SidebarPro() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-green-pale min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-green-pale">
        <span className="font-syne font-bold text-green-dark text-sm">Espace Pro</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'sidebar-link',
              pathname === l.href || pathname.startsWith(l.href + '/')
                ? 'sidebar-link-active'
                : 'sidebar-link-idle'
            )}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
