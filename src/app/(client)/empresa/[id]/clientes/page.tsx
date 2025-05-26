import { Metadata } from 'next'
import { CustomerList } from '@/components/customers/CustomerList'
import { CustomerFilters } from '@/components/customers/CustomerFilters'

export const metadata: Metadata = {
  title: 'Gestão de Clientes - iServiços',
  description: 'Gerencie seus clientes, histórico de serviços e preferências.',
}

export default function CustomersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes, histórico de serviços e preferências.
        </p>
      </div>

      <CustomerFilters />
      <CustomerList />
    </div>
  )
} 