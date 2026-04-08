'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Vue globale', icon: '📊' },
  { href: '/admin/pros', label: 'Validation pros', icon: '✅' },
  { href: '/admin/aos', label: 'Appels d\'offres', icon: '📋' },
  { href: '/admin/leads', label: 'Leads questionnaire', icon: '🎯' },
]

export default function SidebarAdmin() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-green-dark min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-white/10">
        <span className="font-syne font-bold text-green-light text-sm">Admin VertiCall</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === l.href
                ? 'bg-green-light/20 text-green-light'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
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
