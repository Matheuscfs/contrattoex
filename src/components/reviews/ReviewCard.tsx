'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ReviewWithRelations, ReviewResponse } from '@/types/review';
import { createClient } from '@/lib/supabase/client';

interface ReviewCardProps {
  review: ReviewWithRelations;
  canRespond?: boolean;
  onResponseSubmit?: (response: ReviewResponse) => Promise<void>;
}

export function ReviewCard({ review, canRespond = false, onResponseSubmit }: ReviewCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [response, setResponse] = useState(review.response_comment || '');
  const [showImages, setShowImages] = useState(false);
  const { toast } = useToast();

  const handleResponseSubmit = async () => {
    if (!onResponseSubmit) return;

    try {
      await onResponseSubmit({ response_comment: response });
      setIsResponding(false);
      toast({
        title: 'Resposta enviada',
        description: 'Sua resposta foi enviada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar resposta',
        description: 'Ocorreu um erro ao enviar sua resposta. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.avatar_url || ''} alt={review.user.name || ''} />
              <AvatarFallback>
                {review.user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {review.service.name}
                </Badge>
                {review.professional && (
                  <Badge variant="outline" className="text-xs">
                    {review.professional.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-700">{review.comment}</p>

        {review.images && review.images.length > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowImages(true)}
            >
              <ImageIcon className="w-4 h-4" />
              Ver fotos ({review.images.length})
            </Button>

            <Dialog open={showImages} onOpenChange={setShowImages}>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {review.images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Foto ${index + 1} da avaliação`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {review.response_comment && (
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Resposta da empresa</span>
              {review.response_date && (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(review.response_date), "d 'de' MMMM", { locale: ptBR })}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{review.response_comment}</p>
          </div>
        )}

        {canRespond && !review.response_comment && (
          <div className="mt-4">
            {!isResponding ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsResponding(true)}
              >
                <MessageCircle className="w-4 h-4" />
                Responder avaliação
              </Button>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Digite sua resposta..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleResponseSubmit}>
                    Enviar resposta
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsResponding(false);
                      setResponse('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 