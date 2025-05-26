import { BaseFilter } from './BaseFilter'
import { useSearchHistory } from '@/hooks/useSearchHistory'

const BUSINESS_TYPES = [
  { value: 'salao', label: 'Salão de Beleza' },
  { value: 'barbearia', label: 'Barbearia' },
  { value: 'estetica', label: 'Estética' },
  { value: 'pet', label: 'Pet Shop' },
  { value: 'mecanica', label: 'Oficina Mecânica' },
  { value: 'medico', label: 'Consultório Médico' },
  { value: 'odonto', label: 'Consultório Odontológico' },
  { value: 'outros', label: 'Outros' }
]

const PAYMENT_METHODS = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'credito', label: 'Cartão de Crédito' },
  { value: 'debito', label: 'Cartão de Débito' }
]

const CERTIFICATIONS = [
  { value: 'anvisa', label: 'ANVISA' },
  { value: 'iso', label: 'ISO' },
  { value: 'crea', label: 'CREA' },
  { value: 'crm', label: 'CRM' },
  { value: 'cro', label: 'CRO' }
]

interface CompanyFiltersProps {
  onFilterChange: (filters: any) => void
}

export function CompanyFilters({ onFilterChange }: CompanyFiltersProps) {
  const { history, addToHistory } = useSearchHistory('empresa')

  const handleFilterChange = (filters: any) => {
    // Se houver termo de busca, adiciona ao histórico
    if (filters.search) {
      addToHistory(filters.search)
    }
    onFilterChange(filters)
  }

  const filterConfig = [
    {
      id: 'businessType',
      type: 'select' as const,
      label: 'Tipo de Negócio',
      placeholder: 'Selecione o tipo',
      options: BUSINESS_TYPES
    },
    {
      id: 'distance',
      type: 'range' as const,
      label: 'Distância (km)',
      min: 0,
      max: 50
    },
    {
      id: 'rating',
      type: 'range' as const,
      label: 'Avaliação',
      min: 0,
      max: 5
    },
    {
      id: 'priceRange',
      type: 'range' as const,
      label: 'Faixa de Preço',
      min: 0,
      max: 1000
    },
    {
      id: 'paymentMethods',
      type: 'select' as const,
      label: 'Formas de Pagamento',
      placeholder: 'Selecione as formas aceitas',
      options: PAYMENT_METHODS
    },
    {
      id: 'certifications',
      type: 'select' as const,
      label: 'Certificações',
      placeholder: 'Selecione as certificações',
      options: CERTIFICATIONS
    },
    {
      id: 'isOpen',
      type: 'boolean' as const,
      label: 'Aberto Agora',
      placeholder: 'Filtrar por status'
    }
  ]

  return (
    <BaseFilter
      filterConfig={filterConfig}
      onFilterChange={handleFilterChange}
      persistKey="companyFilters"
      searchType="empresa"
      defaultFilters={{
        search: '',
        businessType: '',
        distanceMin: 0,
        distanceMax: 50,
        rating: 0,
        priceRangeMin: 0,
        priceRangeMax: 1000,
        paymentMethods: [],
        certifications: [],
        isOpen: null
      }}
    />
  )
} 