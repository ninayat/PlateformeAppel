'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin',        label: 'Vue globale',      icon: '⊞' },
  { href: '/admin/pros',   label: 'Validation pros',  icon: '✓' },
  { href: '/admin/aos',    label: 'Appels d\'offres', icon: '◈' },
  { href: '/admin/leads',  label: 'Leads',            icon: '◎' },
]

export default function SidebarAdmin() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-green-dark flex flex-col">
      <div className="px-5 py-5 border-b border-white/8">
        <div className="font-syne font-extrabold text-white text-base">
          Verti<span className="text-green-light">Call</span>
        </div>
        <div className="text-xs text-white/40 mt-0.5 font-medium">Administration</div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 py-2">
          Gestion
        </span>
        {links.map((l) => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-green-light/15 text-green-light'
                  : 'text-white/50 hover:bg-white/6 hover:text-white/80'
              )}>
              <span className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold',
                active ? 'bg-green-light/20 text-green-light' : 'bg-white/6 text-white/30'
              )}>
                {l.icon}
              </span>
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
