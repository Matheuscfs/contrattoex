import { useSearchAnalytics } from '@/hooks/useSearchAnalytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SearchMetricsProps {
  type: string
}

export function SearchMetrics({ type }: SearchMetricsProps) {
  const {
    getPopularTerms,
    getConversionRate,
    getAverageTimeToConversion,
    getMostUsedFilters
  } = useSearchAnalytics(type)

  const popularTerms = getPopularTerms(5)
  const conversionRate = getConversionRate('book')
  const avgTimeToConversion = getAverageTimeToConversion()
  const mostUsedFilters = getMostUsedFilters(5)

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    return `${hours}h${minutes % 60}min`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Métricas Principais */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Conversão</CardTitle>
          <CardDescription>Desempenho geral das buscas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
              <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tempo Médio até Conversão</p>
              <p className="text-2xl font-bold">{formatTime(avgTimeToConversion)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Termos Populares */}
      <Card>
        <CardHeader>
          <CardTitle>Termos Mais Buscados</CardTitle>
          <CardDescription>Top 5 termos de busca</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Termo</TableHead>
                <TableHead className="text-right">Buscas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularTerms.map((item) => (
                <TableRow key={item.term}>
                  <TableCell>{item.term}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filtros Mais Usados */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Filtros Mais Utilizados</CardTitle>
          <CardDescription>Preferências de filtragem dos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filtro</TableHead>
                <TableHead className="text-right">Utilizações</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostUsedFilters.map((item) => (
                <TableRow key={item.filter}>
                  <TableCell>{item.filter}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right">
                    {((item.count / mostUsedFilters.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 