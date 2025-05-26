import { Metadata } from "next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormAgendamento } from "@/components/agendamento/form-agendamento"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/types/database"

export const metadata: Metadata = {
  title: "Meus Agendamentos",
  description: "Gerencie seus agendamentos de serviços.",
}

export default async function AgendamentosPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  // Busca os agendamentos do cliente
  const { data: { user } } = await supabase.auth.getUser()
  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('*, services(*)')
    .eq('cliente_id', user?.id)
    .order('data_hora_inicio', { ascending: true })
    .limit(10)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Meus Agendamentos</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Seus agendamentos para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agendamentos && agendamentos.length > 0 ? (
              <div className="space-y-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.id}>
                    <CardHeader>
                      <CardTitle>{agendamento.services?.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(agendamento.data_hora_inicio), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Status: {agendamento.status}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Você não tem agendamentos próximos.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="col-span-3">
          <FormAgendamento />
        </div>
      </div>
    </div>
  )
} 