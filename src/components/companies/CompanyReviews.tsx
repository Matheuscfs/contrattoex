import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  service: {
    name: string;
  };
}

interface CompanyReviewsProps {
  reviews: Review[];
}

export function CompanyReviews({ reviews }: CompanyReviewsProps) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                    <time className="text-sm text-gray-500">{formatDate(review.createdAt)}</time>
                  </div>
                  <div className="flex items-center mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Serviço: {review.service.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 