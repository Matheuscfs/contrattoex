import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyForm } from './CompanyForm'
import { AddressForm } from './AddressForm'
import { ContactForm } from './ContactForm'
import { BusinessHoursForm } from './BusinessHoursForm'

export default async function SettingsPage() {
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

  // Buscar endereço
  const { data: address } = await supabase
    .from('company_addresses')
    .select('*')
    .eq('company_id', company.id)
    .single()

  // Buscar contatos
  const { data: contact } = await supabase
    .from('company_contacts')
    .select('*')
    .eq('company_id', company.id)
    .single()

  // Buscar horários
  const { data: businessHours } = await supabase
    .from('company_business_hours')
    .select('*')
    .eq('company_id', company.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações da sua empresa</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="company">
          <TabsList>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="hours">Horários</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanyForm company={company} />
          </TabsContent>

          <TabsContent value="address">
            <AddressForm address={address} companyId={company.id} />
          </TabsContent>

          <TabsContent value="contact">
            <ContactForm contact={contact} companyId={company.id} />
          </TabsContent>

          <TabsContent value="hours">
            <BusinessHoursForm hours={businessHours || []} companyId={company.id} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 