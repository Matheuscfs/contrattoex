'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AgendamentosDataTable } from './_components/agendamentos-data-table'
import { ResumoAgendamentos } from './_components/resumo-agendamentos'
import { CriarAgendamentoSheet } from './_components/criar-agendamento-sheet'
import { ptBR } from 'date-fns/locale'

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os agendamentos da sua empresa
          </p>
        </div>
        <CriarAgendamentoSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </CriarAgendamentoSheet>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="border rounded-md"
              />
            </CardContent>
          </Card>
          {selectedDate && <ResumoAgendamentos data={selectedDate} />}
        </div>
        <AgendamentosDataTable data={selectedDate} />
      </div>
    </div>
  )
} 