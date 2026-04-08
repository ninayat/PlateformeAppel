// Server component — fournit generateStaticParams pour toutes les pages [id]
import { MOCK_AOS } from '@/lib/mock-data'

export function generateStaticParams() {
  return MOCK_AOS.map((ao) => ({ id: ao.id }))
}

export default function AOLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
