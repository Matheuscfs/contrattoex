import { Metadata } from 'next'
import { ProfessionalList } from '@/components/professionals/ProfessionalList'
import { ProfessionalFilters } from '@/components/professionals/ProfessionalFilters'

export const metadata: Metadata = {
  title: 'Gestão de Profissionais - iServiços',
  description: 'Gerencie sua equipe de profissionais, especialidades e comissões.',
}

export default function ProfessionalsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Profissionais</h1>
        <p className="text-muted-foreground">
          Gerencie sua equipe de profissionais, especialidades e comissões.
        </p>
      </div>

      <ProfessionalFilters />
      <ProfessionalList />
    </div>
  )
} 