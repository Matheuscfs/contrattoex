import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Company } from '@/types/company'

interface CompanyReviewsProps {
  company: Company
}

export function CompanyReviews({ company }: CompanyReviewsProps) {
  // TODO: Implementar busca de avaliações da API
  const reviews = [
    {
      id: '1',
      user: {
        name: 'João Silva',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
      },
      rating: 5,
      comment: 'Excelente serviço! Profissionais muito atenciosos e competentes.',
      date: '2024-03-15'
    },
    {
      id: '2',
      user: {
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
      },
      rating: 4,
      comment: 'Bom atendimento, mas o preço é um pouco alto.',
      date: '2024-03-10'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Resumo das avaliações */}
        <div className="flex items-center gap-4 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{company.rating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(company.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {company.total_reviews} avaliações
            </div>
          </div>

          {/* Distribuição das avaliações */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-1">
                <div className="text-sm text-gray-600 w-3">{rating}</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-12">
                  {Math.round((rating / 5) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de avaliações */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                    <AvatarFallback>
                      {review.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <p className="text-gray-600 mt-3">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 