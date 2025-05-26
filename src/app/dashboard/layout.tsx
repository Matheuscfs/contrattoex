import { Toaster } from 'sonner'
import { SidebarNav } from '@/components/SidebarNav'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/entrar')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="py-6">
          {children}
        </div>
      </main>

      {/* Toaster para notificações */}
      <Toaster />
    </div>
  )
} 