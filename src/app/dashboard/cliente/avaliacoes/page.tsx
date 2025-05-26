import { Metadata } from "next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Minhas Avaliações",
  description: "Gerencie suas avaliações de serviços.",
}

export default function AvaliacoesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Minhas Avaliações</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Barbearia Exemplo
              </CardTitle>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Corte de Cabelo • {format(new Date(), "PPP", { locale: ptBR })}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Excelente atendimento! O profissional foi muito atencioso e o
              resultado ficou perfeito. Recomendo!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 