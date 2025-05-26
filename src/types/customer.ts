export interface Customer {
  id: string
  user_id?: string | null
  company_id: string
  name: string
  email: string | null
  phone: string | null
  cpf: string | null
  birth_date: string | null
  gender: string | null
  notes: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
  total_appointments?: number
  total_spent?: number
  last_visit?: string | null
} 