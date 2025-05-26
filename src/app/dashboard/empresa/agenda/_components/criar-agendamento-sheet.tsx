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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { useServicosContext } from '@/contexts/servicos-context'
import { useAgendamentosContext } from '@/contexts/agendamentos-context'
import { createAgendamento } from '@/lib/agendamentos'
import { SelecaoHorario } from './selecao-horario'
import { ptBR } from 'date-fns/locale'

// Schema de validação
const agendamentoSchema = z.object({
  cliente_id: z.string().min(1, 'Selecione um cliente'),
  servico_id: z.string().min(1, 'Selecione um serviço'),
  data: z.date({
    required_error: 'Selecione uma data',
  }),
  observacoes: z.string().optional(),
})

interface CriarAgendamentoSheetProps {
  children: React.ReactNode
}

export function CriarAgendamentoSheet({ children }: CriarAgendamentoSheetProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [horarioSelecionado, setHorarioSelecionado] = useState<Date>()
  const { toast } = useToast()
  const { user } = useAuth()
  const { servicos } = useServicosContext()
  const { addAgendamento } = useAgendamentosContext()
  
  const form = useForm<z.infer<typeof agendamentoSchema>>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      cliente_id: '',
      servico_id: '',
      observacoes: '',
    },
  })

  const servicoSelecionado = servicos.find(
    (servico) => servico.id === form.watch('servico_id')
  )

  async function onSubmit(values: z.infer<typeof agendamentoSchema>) {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      if (!horarioSelecionado) {
        toast({
          title: 'Erro',
          description: 'Selecione um horário para o agendamento',
          variant: 'destructive',
        })
        return
      }

      if (!servicoSelecionado) {
        toast({
          title: 'Erro',
          description: 'Selecione um serviço válido',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)

      const agendamento = await createAgendamento({
        empresa_id: user.id,
        cliente_id: values.cliente_id,
        servico_id: values.servico_id,
        data_hora: horarioSelecionado.toISOString(),
        duracao: servicoSelecionado.duracao,
        preco: servicoSelecionado.preco,
        observacoes: values.observacoes,
      })

      addAgendamento(agendamento)
      
      toast({
        title: 'Sucesso',
        description: 'Agendamento criado com sucesso!',
      })

      // Fechar o sheet e resetar o form
      setOpen(false)
      form.reset()
      setHorarioSelecionado(undefined)
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o agendamento.',
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
          <SheetTitle>Novo Agendamento</SheetTitle>
          <SheetDescription>
            Agende um novo serviço para um cliente
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="ID do Cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servico_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servicos.map((servico) => (
                          <SelectItem key={servico.id} value={servico.id}>
                            {servico.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                        className="border rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('data') && servicoSelecionado && user?.id && (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <SelecaoHorario
                      empresaId={user.id}
                      data={form.watch('data')}
                      duracaoServico={servicoSelecionado.duracao}
                      onSelect={setHorarioSelecionado}
                      horarioSelecionado={horarioSelecionado}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

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
                  {isLoading ? 'Criando...' : 'Criar Agendamento'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
} 