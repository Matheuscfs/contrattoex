import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Review {
  id: string;
  serviceName: string;
  providerName: string;
  rating: number;
  comment: string;
  date: Date;
  images?: string[];
}

interface ReviewsListProps {
  reviews: Review[];
  onEditReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
}

export function ReviewsList({
  reviews,
  onEditReview,
  onDeleteReview,
}: ReviewsListProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas Avaliações</h1>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{review.serviceName}</CardTitle>
                  <CardDescription>
                    Prestador: {review.providerName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {format(review.date, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Imagem ${index + 1} da avaliação`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditReview(review.id)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteReview(review.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 