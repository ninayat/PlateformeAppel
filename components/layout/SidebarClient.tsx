'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/client/dashboard', label: 'Tableau de bord', icon: '🏠' },
  { href: '/client/ao/new', label: 'Publier un AO', icon: '➕' },
  { href: '/client/messages', label: 'Messages', icon: '💬' },
]

export default function SidebarClient() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-green-pale min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-green-pale">
        <span className="font-syne font-bold text-green-dark text-sm">Espace Client</span>
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
      <div className="p-4 border-t border-green-pale">
        <Link href="/questionnaire" className="text-xs text-green-mid hover:underline">
          Questionnaire
        </Link>
      </div>
    </aside>
  )
}
