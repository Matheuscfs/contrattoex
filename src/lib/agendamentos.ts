import { supabase } from './supabase'
import { Database } from '@/types/supabase'
import { addDays, format, parseISO, startOfDay, endOfDay } from 'date-fns'

export type Agendamento = Database['public']['Tables']['agendamentos']['Row']
export type CreateAgendamentoData = Omit<
  Database['public']['Tables']['agendamentos']['Insert'],
  'id' | 'status' | 'created_at' | 'updated_at'
>
export type UpdateAgendamentoData = Partial<Omit<CreateAgendamentoData, 'empresa_id' | 'cliente_id'>> & {
  status?: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
}

// Buscar agendamentos da empresa
export async function getAgendamentosEmpresa(empresaId: string, filtros?: {
  status?: Agendamento['status']
  dataInicio?: Date
  dataFim?: Date
}) {
  let query = supabase
    .from('agendamentos')
    .select(`
      *,
      servico:servicos(
        nome,
        descricao,
        categoria
      )
    `)
    .eq('empresa_id', empresaId)
    .order('data_hora', { ascending: true })

  if (filtros?.status) {
    query = query.eq('status', filtros.status)
  }

  if (filtros?.dataInicio) {
    query = query.gte('data_hora', startOfDay(filtros.dataInicio).toISOString())
  }

  if (filtros?.dataFim) {
    query = query.lte('data_hora', endOfDay(filtros.dataFim).toISOString())
  }

  const { data, error } = await query

  if (error) {
    throw new Error('Erro ao buscar agendamentos: ' + error.message)
  }

  return data
}

// Buscar agendamentos do cliente
export async function getAgendamentosCliente(clienteId: string, filtros?: {
  status?: Agendamento['status']
  dataInicio?: Date
  dataFim?: Date
}) {
  let query = supabase
    .from('agendamentos')
    .select(`
      *,
      servico:servicos(
        nome,
        descricao,
        categoria
      )
    `)
    .eq('cliente_id', clienteId)
    .order('data_hora', { ascending: true })

  if (filtros?.status) {
    query = query.eq('status', filtros.status)
  }

  if (filtros?.dataInicio) {
    query = query.gte('data_hora', startOfDay(filtros.dataInicio).toISOString())
  }

  if (filtros?.dataFim) {
    query = query.lte('data_hora', endOfDay(filtros.dataFim).toISOString())
  }

  const { data, error } = await query

  if (error) {
    throw new Error('Erro ao buscar agendamentos: ' + error.message)
  }

  return data
}

// Criar agendamento
export async function createAgendamento(agendamento: CreateAgendamentoData) {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([agendamento])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar agendamento: ' + error.message)
  }

  return data
}

// Atualizar agendamento
export async function updateAgendamento(id: string, agendamento: UpdateAgendamentoData) {
  const { data, error } = await supabase
    .from('agendamentos')
    .update({
      ...agendamento,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao atualizar agendamento: ' + error.message)
  }

  return data
}

// Verificar disponibilidade de horário
export async function verificarDisponibilidade(empresaId: string, dataHora: Date, duracao: number) {
  const inicio = format(dataHora, "yyyy-MM-dd'T'HH:mm:ssXXX")
  const fim = format(addDays(dataHora, duracao), "yyyy-MM-dd'T'HH:mm:ssXXX")

  const { data, error } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('empresa_id', empresaId)
    .neq('status', 'cancelado')
    .or(`data_hora.gte.${inicio},data_hora.lte.${fim}`)
    .limit(1)

  if (error) {
    throw new Error('Erro ao verificar disponibilidade: ' + error.message)
  }

  return data.length === 0
}

// Buscar horários disponíveis usando a função SQL
export async function getHorariosDisponiveis(empresaId: string, data: Date, duracaoServico: number) {
  const { data: horarios, error } = await supabase
    .rpc('horarios_disponiveis', {
      p_empresa_id: empresaId,
      p_data: format(data, 'yyyy-MM-dd'),
      p_duracao_servico: duracaoServico,
    })

  if (error) {
    throw new Error('Erro ao buscar horários disponíveis: ' + error.message)
  }

  return horarios.map(h => new Date(h.horario))
} 