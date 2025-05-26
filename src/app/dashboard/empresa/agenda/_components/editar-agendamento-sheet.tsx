'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAgendamentosContext } from '@/contexts/agendamentos-context'
import { Agendamento, updateAgendamento } from '@/lib/agendamentos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Schema de validação
const editarAgendamentoSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'concluido', 'cancelado']),
  observacoes: z.string().optional(),
})

interface EditarAgendamentoSheetProps {
  agendamento: Agendamento
  children: React.ReactNode
}

export function EditarAgendamentoSheet({ agendamento, children }: EditarAgendamentoSheetProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateAgendamentoLocal } = useAgendamentosContext()
  
  const form = useForm<z.infer<typeof editarAgendamentoSchema>>({
    resolver: zodResolver(editarAgendamentoSchema),
    defaultValues: {
      status: agendamento.status,
      observacoes: agendamento.observacoes || '',
    },
  })

  async function onSubmit(values: z.infer<typeof editarAgendamentoSchema>) {
    try {
      setIsLoading(true)

      const agendamentoAtualizado = await updateAgendamento(agendamento.id, values)
      updateAgendamentoLocal(agendamentoAtualizado)
      
      toast({
        title: 'Sucesso',
        description: 'Agendamento atualizado com sucesso!',
      })

      setOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o agendamento.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Editar Agendamento</SheetTitle>
          <SheetDescription>
            Agendamento de {agendamento.servico.nome} para{' '}
            {format(new Date(agendamento.data_hora), "dd 'de' MMMM 'às' HH:mm", {
              locale: ptBR,
            })}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre o agendamento..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
} 