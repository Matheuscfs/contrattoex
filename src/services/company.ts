import { createClient } from '@/lib/supabase/server'
import { Company } from '@/types/company'

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      description,
      logo_url,
      banner_url,
      rating,
      total_reviews,
      categories,
      is_open,
      distance,
      address:company_addresses (
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        postal_code,
        latitude,
        longitude
      ),
      contact:company_contacts (
        phone,
        email,
        whatsapp,
        website,
        social_media
      ),
      business_hours:company_business_hours (
        day,
        open,
        close,
        is_closed
      ),
      services:company_services (
        id,
        name,
        description,
        price,
        duration,
        category
      )
    `)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return data as Company[]
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      description,
      logo_url,
      banner_url,
      rating,
      total_reviews,
      categories,
      is_open,
      distance,
      address:company_addresses (
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        postal_code,
        latitude,
        longitude
      ),
      contact:company_contacts (
        phone,
        email,
        whatsapp,
        website,
        social_media
      ),
      business_hours:company_business_hours (
        day,
        open,
        close,
        is_closed
      ),
      services:company_services (
        id,
        name,
        description,
        price,
        duration,
        category
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }

  return data as Company
} 