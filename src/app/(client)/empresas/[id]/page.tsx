import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCompanyById } from '@/services/company'
import { CompanyHeader } from '@/components/company/CompanyHeader'
import { CompanyServices } from '@/components/company/CompanyServices'
import { CompanyReviews } from '@/components/company/CompanyReviews'
import { CompanyInfo } from '@/components/company/CompanyInfo'

interface CompanyDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const company = await getCompanyById(params.id)

  if (!company) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <CompanyHeader company={company} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div>Carregando serviços...</div>}>
              <CompanyServices company={company} />
            </Suspense>

            <Suspense fallback={<div>Carregando avaliações...</div>}>
              <CompanyReviews company={company} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CompanyInfo company={company} />
          </div>
        </div>
      </div>
    </main>
  )
} 