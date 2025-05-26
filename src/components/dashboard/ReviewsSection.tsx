'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Avaliações</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma avaliação ainda.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 