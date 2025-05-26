export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      horarios_disponiveis: {
        Row: {
          id: string
          prestador_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          intervalo_agendamento: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          prestador_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          intervalo_agendamento?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          prestador_id?: string
          dia_semana?: number
          hora_inicio?: string
          hora_fim?: string
          intervalo_agendamento?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      horarios_excecoes: {
        Row: {
          id: string
          prestador_id: string
          data: string
          tipo: 'feriado' | 'folga' | 'horario_especial'
          hora_inicio: string | null
          hora_fim: string | null
          descricao: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          prestador_id: string
          data: string
          tipo: 'feriado' | 'folga' | 'horario_especial'
          hora_inicio?: string | null
          hora_fim?: string | null
          descricao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          prestador_id?: string
          data?: string
          tipo?: 'feriado' | 'folga' | 'horario_especial'
          hora_inicio?: string | null
          hora_fim?: string | null
          descricao?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      agendamentos: {
        Row: {
          id: string
          prestador_id: string
          servico_id: string
          cliente_id: string
          data_hora_inicio: string
          data_hora_fim: string
          status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          prestador_id: string
          servico_id: string
          cliente_id: string
          data_hora_inicio: string
          data_hora_fim: string
          status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          prestador_id?: string
          servico_id?: string
          cliente_id?: string
          data_hora_inicio?: string
          data_hora_fim?: string
          status?: 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 