import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAgendamentos } from '@/lib/hooks/use-agendamentos'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from 'lucide-react'

type Agendamento = Database['public']['Tables']['agendamentos']['Row'] & {
  services: Database['public']['Tables']['services']['Row'] | null
}

export function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [agendamentoCancelar, setAgendamentoCancelar] = useState<string>()
  const { loading, getAgendamentos, cancelarAgendamento } = useAgendamentos()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function carregarAgendamentos() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getAgendamentos(user.id)
        if (data) {
          setAgendamentos(data as Agendamento[])
        }
      }
    }

    carregarAgendamentos()
  }, [getAgendamentos, supabase])

  async function handleCancelarAgendamento(id: string) {
    const agendamento = await cancelarAgendamento(id)
    if (agendamento) {
      setAgendamentos(agendamentos.map(a => 
        a.id === id ? { ...a, status: 'cancelado' } : a
      ))
    }
    setAgendamentoCancelar(undefined)
  }

  if (loading && agendamentos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {agendamentos.length > 0 ? (
        agendamentos.map((agendamento) => (
          <Card key={agendamento.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{agendamento.services?.name}</CardTitle>
                  <CardDescription>
                    {format(parseISO(agendamento.data_hora_inicio), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </div>
                {agendamento.status === 'pendente' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setAgendamentoCancelar(agendamento.id)}
                      >
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAgendamentoCancelar(undefined)}>
                          Não, manter agendamento
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelarAgendamento(agendamento.id)}
                        >
                          Sim, cancelar agendamento
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Status: {agendamento.status}
                </p>
                {agendamento.services && (
                  <p className="text-sm font-medium">
                    R$ {agendamento.services.price.toFixed(2)}
                  </p>
                )}
              </div>
              {agendamento.observacoes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {agendamento.observacoes}
                </p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum Agendamento</CardTitle>
            <CardDescription>
              Você ainda não tem nenhum agendamento.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
} 