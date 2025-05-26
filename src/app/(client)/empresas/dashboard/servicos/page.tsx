import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default async function ServicesPage() {
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

  // Buscar serviços da empresa
  const { data: services } = await supabase
    .from('company_services')
    .select('*')
    .eq('company_id', company.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Serviços</h1>
          <p className="text-gray-500">Gerencie os serviços oferecidos pela sua empresa</p>
        </div>

        <Link href="/empresas/dashboard/servicos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-gray-500">{service.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Preço</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(service.price)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duração</p>
                <p>{service.duration} minutos</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Categoria</p>
                <p>{service.category}</p>
              </div>

              <div className="flex justify-end">
                <Link href={`/empresas/dashboard/servicos/${service.id}`}>
                  <Button variant="outline">Editar</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {services?.length === 0 && (
          <div className="col-span-full">
            <Card className="p-6 text-center">
              <p className="text-gray-500">Nenhum serviço cadastrado</p>
              <Link href="/empresas/dashboard/servicos/novo" className="text-primary hover:underline">
                Cadastrar primeiro serviço
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 