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
      servicos: {
        Row: {
          id: string
          empresa_id: string
          nome: string
          descricao: string
          preco: number
          duracao: number
          categoria: string
          status: 'ativo' | 'inativo'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id: string
          nome: string
          descricao: string
          preco: number
          duracao: number
          categoria: string
          status?: 'ativo' | 'inativo'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          nome?: string
          descricao?: string
          preco?: number
          duracao?: number
          categoria?: string
          status?: 'ativo' | 'inativo'
          created_at?: string
          updated_at?: string
        }
      }
      agendamentos: {
        Row: {
          id: string
          empresa_id: string
          cliente_id: string
          servico_id: string
          data_hora: string
          duracao: number
          preco: number
          status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
          observacoes?: string
          created_at: string
          updated_at: string
          servico: {
            id: string
            nome: string
            descricao: string
            categoria: string
          }
        }
        Insert: {
          id?: string
          empresa_id: string
          cliente_id: string
          servico_id: string
          data_hora: string
          duracao: number
          preco: number
          status?: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
          observacoes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string
          cliente_id?: string
          servico_id?: string
          data_hora?: string
          duracao?: number
          preco?: number
          status?: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
          observacoes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      horarios_disponiveis: {
        Args: {
          p_empresa_id: string
          p_data: string
          p_duracao_servico: number
        }
        Returns: {
          horario: string
        }[]
      }
    }
    Enums: {
      servico_status: 'ativo' | 'inativo'
      agendamento_status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
    }
  }
} 