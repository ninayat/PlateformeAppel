import Navbar from '@/components/layout/Navbar'
import SidebarClient from '@/components/layout/SidebarClient'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SidebarClient />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
