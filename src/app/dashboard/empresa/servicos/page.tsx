'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ServicosDataTable } from './_components/servicos-data-table'
import { CreateServicoSheet } from './_components/create-servico-sheet'

export default function ServicosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços oferecidos pela sua empresa
          </p>
        </div>

        <CreateServicoSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Button>
        </CreateServicoSheet>
      </div>

      <ServicosDataTable />
    </div>
  )
} 