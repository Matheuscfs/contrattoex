'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, UserPlus } from 'lucide-react'
import { CustomerForm } from './CustomerForm'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  cpf: string | null
  total_appointments: number
  total_spent: number
  last_visit: string | null
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name')

      if (error) throw error

      setCustomers(data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os clientes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id)

      if (error) throw error

      setCustomers(customers.filter((c) => c.id !== id))
      toast({
        title: 'Sucesso',
        description: 'Cliente excluído com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cliente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Clientes</h2>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Total Agendamentos</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {customer.email && (
                      <div className="text-sm">{customer.email}</div>
                    )}
                    {customer.phone && (
                      <div className="text-sm text-muted-foreground">
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{customer.cpf}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {customer.total_appointments}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(customer.total_spent)}
                </TableCell>
                <TableCell>
                  {customer.last_visit
                    ? new Date(customer.last_visit).toLocaleDateString('pt-BR')
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <CustomerForm
          customer={selectedCustomer}
          onClose={() => {
            setShowForm(false)
            setSelectedCustomer(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedCustomer(null)
            loadCustomers()
          }}
        />
      )}
    </div>
  )
} 