import { CompanyCard } from './CompanyCard'
import { getCompanies } from '@/services/company'

export async function CompanyList() {
  const companies = await getCompanies()

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h3>
        <p className="text-gray-600">Tente ajustar os filtros de busca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
} 