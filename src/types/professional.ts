export interface Professional {
  id: string
  user_id?: string | null
  company_id: string
  name: string
  email: string | null
  phone: string | null
  cpf: string | null
  specialties: string[]
  commission_rate: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
} 