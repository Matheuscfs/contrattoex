import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, LayoutDashboard, Settings } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/empresas/login')
  }

  // Buscar dados da empresa
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('email', session.user.email)
    .single()

  if (!company) {
    redirect('/empresas/cadastro')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="iServiços" width={120} height={32} />
          </Link>

          <nav className="flex items-center gap-4">
            <Link href={`/empresas/${company.id}/perfil`} className="text-gray-600 hover:text-gray-900">
              Ver Perfil Público
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                href="/empresas/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/empresas/dashboard/servicos"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Building2 className="w-5 h-5" />
                <span>Serviços</span>
              </Link>
              <Link
                href="/empresas/dashboard/configuracoes"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </Link>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 