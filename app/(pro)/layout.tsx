import Navbar from '@/components/layout/Navbar'
import SidebarPro from '@/components/layout/SidebarPro'

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SidebarPro />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
