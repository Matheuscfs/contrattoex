import { supabase } from './supabase'
import { Database } from '@/types/supabase'

export type Servico = Database['public']['Tables']['servicos']['Row']
export type CreateServicoData = Omit<
  Database['public']['Tables']['servicos']['Insert'],
  'id' | 'empresa_id' | 'status' | 'created_at' | 'updated_at'
>
export type UpdateServicoData = Partial<CreateServicoData> & {
  status?: 'ativo' | 'inativo'
}

export async function getServicos(empresaId: string) {
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar serviços: ' + error.message)
  }

  return data
}

export async function createServico(empresaId: string, servico: CreateServicoData) {
  const { data, error } = await supabase
    .from('servicos')
    .insert([
      {
        ...servico,
        empresa_id: empresaId,
        status: 'ativo',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao criar serviço: ' + error.message)
  }

  return data
}

export async function updateServico(id: string, servico: UpdateServicoData) {
  const { data, error } = await supabase
    .from('servicos')
    .update({
      ...servico,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Erro ao atualizar serviço: ' + error.message)
  }

  return data
}

export async function deleteServico(id: string) {
  const { error } = await supabase
    .from('servicos')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Erro ao excluir serviço: ' + error.message)
  }
} 