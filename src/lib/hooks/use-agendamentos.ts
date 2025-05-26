import { useCallback, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'
import { addDays, format, parseISO, startOfDay } from 'date-fns'

type Agendamento = Database['public']['Tables']['agendamentos']['Row']
type HorarioDisponivel = Database['public']['Tables']['horarios_disponiveis']['Row']
type HorarioExcecao = Database['public']['Tables']['horarios_excecoes']['Row']

export function useAgendamentos() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const getHorariosDisponiveis = useCallback(async (prestadorId: string, data: Date) => {
    try {
      setLoading(true)
      setError(null)

      // Busca os horários padrão do prestador para o dia da semana
      const diaSemana = data.getDay()
      const { data: horariosPadrao, error: errorHorarios } = await supabase
        .from('horarios_disponiveis')
        .select('*')
        .eq('prestador_id', prestadorId)
        .eq('dia_semana', diaSemana)

      if (errorHorarios) throw errorHorarios

      // Busca exceções para a data
      const { data: excecoes, error: errorExcecoes } = await supabase
        .from('horarios_excecoes')
        .select('*')
        .eq('prestador_id', prestadorId)
        .eq('data', format(data, 'yyyy-MM-dd'))

      if (errorExcecoes) throw errorExcecoes

      // Busca agendamentos existentes para a data
      const dataInicio = startOfDay(data)
      const dataFim = addDays(dataInicio, 1)
      const { data: agendamentos, error: errorAgendamentos } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('prestador_id', prestadorId)
        .gte('data_hora_inicio', format(dataInicio, "yyyy-MM-dd'T'HH:mm:ssXXX"))
        .lt('data_hora_inicio', format(dataFim, "yyyy-MM-dd'T'HH:mm:ssXXX"))
        .not('status', 'eq', 'cancelado')

      if (errorAgendamentos) throw errorAgendamentos

      // TODO: Implementar lógica para gerar horários disponíveis
      // considerando horários padrão, exceções e agendamentos existentes

      return {
        horariosPadrao,
        excecoes,
        agendamentos
      }
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar horários disponíveis',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  const getAgendamentos = useCallback(async (clienteId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('agendamentos')
        .select('*, services(*)')
        .eq('cliente_id', clienteId)
        .order('data_hora_inicio', { ascending: true })

      if (error) throw error

      return data
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar agendamentos',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  const criarAgendamento = useCallback(async (agendamento: Database['public']['Tables']['agendamentos']['Insert']) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('agendamentos')
        .insert(agendamento)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Agendamento criado com sucesso',
        description: `Agendamento para ${format(parseISO(data.data_hora_inicio), 'dd/MM/yyyy HH:mm')}`
      })

      return data
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar agendamento',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  const atualizarAgendamento = useCallback(async (id: string, agendamento: Database['public']['Tables']['agendamentos']['Update']) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('agendamentos')
        .update(agendamento)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Agendamento atualizado com sucesso',
        description: `Agendamento para ${format(parseISO(data.data_hora_inicio), 'dd/MM/yyyy HH:mm')}`
      })

      return data
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar agendamento',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  const cancelarAgendamento = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('agendamentos')
        .update({ status: 'cancelado' })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Agendamento cancelado com sucesso',
        description: `Agendamento para ${format(parseISO(data.data_hora_inicio), 'dd/MM/yyyy HH:mm')}`
      })

      return data
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao cancelar agendamento',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  const reagendarAgendamento = useCallback(async (id: string, novaData: Date) => {
    try {
      setLoading(true)
      setError(null)

      // Busca o agendamento atual
      const { data: agendamentoAtual, error: errorBusca } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('id', id)
        .single()

      if (errorBusca) throw errorBusca

      // Calcula a duração do agendamento em minutos
      const dataInicio = parseISO(agendamentoAtual.data_hora_inicio)
      const dataFim = parseISO(agendamentoAtual.data_hora_fim)
      const duracaoMinutos = Math.round((dataFim.getTime() - dataInicio.getTime()) / 60000)

      // Atualiza o agendamento com a nova data
      const { data, error } = await supabase
        .from('agendamentos')
        .update({
          data_hora_inicio: novaData.toISOString(),
          data_hora_fim: new Date(novaData.getTime() + duracaoMinutos * 60000).toISOString(),
          status: 'pendente' // Volta para pendente para que o prestador confirme novamente
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Agendamento reagendado com sucesso',
        description: `Agendamento alterado para ${format(novaData, 'dd/MM/yyyy HH:mm')}`
      })

      return data
    } catch (err) {
      setError(err as Error)
      toast({
        variant: 'destructive',
        title: 'Erro ao reagendar agendamento',
        description: (err as Error).message
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  return {
    loading,
    error,
    getHorariosDisponiveis,
    getAgendamentos,
    criarAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
    reagendarAgendamento
  }
} 