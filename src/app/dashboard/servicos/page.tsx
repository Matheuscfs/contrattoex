'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Edit, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

interface Service {
  id: string
  title: string
  price: number
  duration: number
  category: string
  status: string
  created_at: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      loadServices()
    }
  }, [user])

  const loadServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices((prev) => prev.filter((service) => service.id !== id))
      toast.success('Serviço excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir serviço:', error)
      toast.error('Erro ao excluir serviço')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      case 'pending_approval':
        return <Badge variant="warning">Pendente</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meus Serviços</CardTitle>
              <CardDescription>
                Gerencie os serviços que você oferece
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/servicos/novo">
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-4">
              Nenhum serviço cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.title}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      {service.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/dashboard/servicos/${service.id}/editar`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 