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
import { ProfessionalForm } from './ProfessionalForm'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Professional } from '@/types/professional'

export function ProfessionalList() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const loadProfessionals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name')

      if (error) throw error

      setProfessionals(data || [])
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os profissionais.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('professionals').delete().eq('id', id)

      if (error) throw error

      setProfessionals(professionals.filter((p) => p.id !== id))
      toast({
        title: 'Sucesso',
        description: 'Profissional excluído com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao excluir profissional:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o profissional.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Profissionais</h2>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Profissional
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell>{professional.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {professional.email && (
                      <div className="text-sm">{professional.email}</div>
                    )}
                    {professional.phone && (
                      <div className="text-sm text-muted-foreground">
                        {professional.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {professional.specialties?.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {professional.commission_rate}%
                </TableCell>
                <TableCell>
                  <Badge
                    variant={professional.status === 'active' ? 'success' : 'secondary'}
                  >
                    {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(professional)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(professional.id)}
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
        <ProfessionalForm
          professional={selectedProfessional}
          onClose={() => {
            setShowForm(false)
            setSelectedProfessional(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedProfessional(null)
            loadProfessionals()
          }}
        />
      )}
    </div>
  )
} 