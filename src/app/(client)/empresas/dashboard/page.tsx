import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Resumo</h2>
            <div className="space-y-2">
              <p><strong>Nome:</strong> {company.name}</p>
              <p><strong>Status:</strong> {company.status}</p>
              <p><strong>Plano:</strong> {company.plan_type}</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
            <div className="space-y-2">
              <p><strong>Avaliação:</strong> {company.rating || 0}/5</p>
              <p><strong>Total de avaliações:</strong> {company.total_reviews || 0}</p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-2">
              <a href={`/empresas/${company.id}/perfil`} className="text-primary hover:underline block">
                Ver Perfil Público
              </a>
              <a href="/empresas/dashboard/configuracoes" className="text-primary hover:underline block">
                Configurações
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 