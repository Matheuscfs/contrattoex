import { CompanyLogoUpdater } from '@/components/admin/CompanyLogoUpdater'

export default function CompanyLogosPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Logos das Empresas</h1>
        <p className="text-gray-600 mt-2">
          Atualize as logos das empresas cadastradas no sistema
        </p>
      </div>
      
      <CompanyLogoUpdater />
    </div>
  )
} 