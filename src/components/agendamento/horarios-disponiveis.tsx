import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAgendamentos } from '@/lib/hooks/use-agendamentos'
import { Loader2 } from 'lucide-react'

interface HorariosDisponiveisProps {
  prestadorId: string
  onSelectHorario?: (horario: Date) => void
}

export function HorariosDisponiveis({ prestadorId, onSelectHorario }: HorariosDisponiveisProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [horarios, setHorarios] = useState<Date[]>([])
  const { loading, getHorariosDisponiveis } = useAgendamentos()

  useEffect(() => {
    if (selectedDate && prestadorId) {
      getHorariosDisponiveis(prestadorId, selectedDate).then((result) => {
        if (result) {
          // TODO: Implementar lógica para gerar horários disponíveis
          // a partir dos dados retornados
          setHorarios([])
        }
      })
    }
  }, [selectedDate, prestadorId, getHorariosDisponiveis])

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={ptBR}
        disabled={{ before: new Date() }}
        className="rounded-md border"
      />

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : horarios.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {horarios.map((horario) => (
                  <Button
                    key={horario.toISOString()}
                    variant="outline"
                    onClick={() => onSelectHorario?.(horario)}
                  >
                    {format(horario, 'HH:mm')}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Nenhum horário disponível para esta data.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 