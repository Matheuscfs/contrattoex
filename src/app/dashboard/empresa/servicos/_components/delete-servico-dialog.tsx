'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Servico, deleteServico } from '@/lib/services'
import { useServicosContext } from '@/contexts/servicos-context'

interface DeleteServicoDialogProps {
  children: React.ReactNode
  servico: Servico
}

export function DeleteServicoDialog({ children, servico }: DeleteServicoDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { removeServico } = useServicosContext()

  async function onDelete() {
    try {
      setIsLoading(true)
      await deleteServico(servico.id)
      
      removeServico(servico.id)
      
      toast({
        title: 'Sucesso',
        description: 'Serviço excluído com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao excluir serviço:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o serviço.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o serviço &quot;{servico.nome}&quot;? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 