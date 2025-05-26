'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ReviewStats as ReviewStatsType } from '@/types/review';
import { createClient } from '@/lib/supabase/client';

interface ReviewStatsProps {
  companyId?: string;
  professionalId?: string;
  serviceId?: string;
  initialStats?: ReviewStatsType;
}

export function ReviewStats({
  companyId,
  professionalId,
  serviceId,
  initialStats,
}: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStatsType>(
    initialStats || {
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: {},
    }
  );
  const [loading, setLoading] = useState(!initialStats);
  const supabase = createClient();

  const loadStats = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('reviews')
        .select('rating')
        .eq('status', 'approved');

      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const reviews = data;
      const total = reviews.length;
      const distribution: { [key: number]: number } = {};
      let sum = 0;

      // Inicializar distribuição
      for (let i = 1; i <= 5; i++) {
        distribution[i] = 0;
      }

      // Calcular distribuição e soma
      reviews.forEach((review) => {
        distribution[review.rating]++;
        sum += review.rating;
      });

      setStats({
        total_reviews: total,
        average_rating: total > 0 ? Number((sum / total).toFixed(1)) : 0,
        rating_distribution: distribution,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialStats) {
      loadStats();
    }
  }, [companyId, professionalId, serviceId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold">{stats.average_rating}</span>
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total_reviews} {stats.total_reviews === 1 ? 'avaliação' : 'avaliações'}
          </p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.rating_distribution[rating] || 0;
            const percentage =
              stats.total_reviews > 0
                ? Math.round((count / stats.total_reviews) * 100)
                : 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-12">
                  <span>{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <Progress value={percentage} className="flex-1" />
                <div className="w-12 text-right text-sm text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 