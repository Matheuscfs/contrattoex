import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Meus Favoritos",
  description: "Gerencie seus serviços e profissionais favoritos.",
}

export default function FavoritosPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Meus Favoritos</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">
              Barbearia Exemplo
            </CardTitle>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5 fill-current text-red-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="mr-1 h-4 w-4" />
                4.8 (120 avaliações)
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                Tempo médio: 30min
              </div>
              <div className="mt-4">
                <Button variant="secondary" className="w-full">
                  Agendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 