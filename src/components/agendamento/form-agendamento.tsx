'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { SelecaoPrestador } from '@/components/agendamento/selecao-prestador'
import { HorariosDisponiveis } from '@/components/agendamento/horarios-disponiveis'
import { useAgendamentos } from '@/lib/hooks/use-agendamentos'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
}

export function FormAgendamento() {
  const [prestadorId, setPrestadorId] = useState<string>()
  const [servicoId, setServicoId] = useState<string>()
  const [servicos, setServicos] = useState<Service[]>([])
  const [horarioSelecionado, setHorarioSelecionado] = useState<Date>()
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(false)
  const [clienteId, setClienteId] = useState<string>()
  const { criarAgendamento } = useAgendamentos()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    // Busca o ID do cliente logado
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setClienteId(user.id)
      }
    })
  }, [supabase])

  useEffect(() => {
    // Busca os serviços do prestador selecionado
    if (prestadorId) {
      supabase
        .from('services')
        .select('*')
        .eq('prestador_id', prestadorId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao buscar serviços:', error)
            return
          }
          setServicos(data as Service[])
        })
    }
  }, [prestadorId, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prestadorId || !horarioSelecionado || !servicoId || !clienteId) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar agendamento',
        description: 'Selecione um profissional, serviço e horário.'
      })
      return
    }

    try {
      setLoading(true)
      const agendamento = await criarAgendamento({
        prestador_id: prestadorId,
        servico_id: servicoId,
        cliente_id: clienteId,
        data_hora_inicio: horarioSelecionado.toISOString(),
        data_hora_fim: new Date(horarioSelecionado.getTime() + 30 * 60000).toISOString(), // 30 minutos
        status: 'pendente',
        observacoes
      })

      if (agendamento) {
        toast({
          title: 'Agendamento criado com sucesso',
          description: `Seu agendamento foi marcado para ${format(horarioSelecionado, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`
        })
        setPrestadorId(undefined)
        setServicoId(undefined)
        setHorarioSelecionado(undefined)
        setObservacoes('')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar agendamento',
        description: 'Ocorreu um erro ao criar o agendamento. Tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Novo Agendamento</CardTitle>
          <CardDescription>
            Selecione um profissional e horário disponível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Profissional
            </label>
            <SelecaoPrestador
              onSelect={setPrestadorId}
            />
          </div>
          {prestadorId && (
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Serviço
              </label>
              <Select onValueChange={setServicoId} value={servicoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.name} - R$ {servico.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {servicoId && (
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Data e Horário
              </label>
              <HorariosDisponiveis
                prestadorId={prestadorId!}
                onSelectHorario={setHorarioSelecionado}
              />
            </div>
          )}
          {horarioSelecionado && (
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Observações
              </label>
              <Textarea
                placeholder="Adicione observações para o profissional..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
          {prestadorId && servicoId && horarioSelecionado && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando agendamento...' : 'Confirmar Agendamento'}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  )
} 