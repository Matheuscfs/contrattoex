'use client';

import { useState, useEffect } from 'react';
import { Star, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReviewCard } from './ReviewCard';
import { ReviewWithRelations, ReviewFilters, ReviewResponse } from '@/types/review';
import { createClient } from '@/lib/supabase/client';

interface ReviewListProps {
  initialReviews?: ReviewWithRelations[];
  filters?: Partial<ReviewFilters>;
  canRespond?: boolean;
  showFilters?: boolean;
  onFiltersChange?: (filters: ReviewFilters) => void;
}

export function ReviewList({
  initialReviews = [],
  filters: initialFilters = {},
  canRespond = false,
  showFilters = true,
  onFiltersChange,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>(initialReviews);
  const [filters, setFilters] = useState<ReviewFilters>({
    ...initialFilters,
    status: initialFilters.status || 'approved',
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();

  const loadReviews = async (reset = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:user_id(*),
          service:service_id(*),
          professional:professional_id(*),
          company:company_id(*)
        `)
        .eq('status', filters.status)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.service_id) {
        query = query.eq('service_id', filters.service_id);
      }
      if (filters.professional_id) {
        query = query.eq('professional_id', filters.professional_id);
      }
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters.rating) {
        query = query.eq('rating', filters.rating);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;

      const newReviews = data as unknown as ReviewWithRelations[];
      
      setReviews(prev => reset ? newReviews : [...prev, ...newReviews]);
      setHasMore(newReviews.length === 10);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(true);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleResponseSubmit = async (reviewId: string, response: ReviewResponse) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          response_comment: response.response_comment,
          response_date: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? {
                ...review,
                response_comment: response.response_comment,
                response_date: new Date().toISOString(),
              }
            : review
        )
      );
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={String(filters.rating || 'all')}
              onValueChange={(value) =>
                handleFilterChange({ rating: value === 'all' ? undefined : Number(value) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as notas</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    <div className="flex items-center gap-2">
                      <span>{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Data inicial</Label>
                    <Input
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) =>
                        handleFilterChange({ date_from: e.target.value || undefined })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data final</Label>
                    <Input
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) =>
                        handleFilterChange({ date_to: e.target.value || undefined })
                      }
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            canRespond={canRespond}
            onResponseSubmit={(response) => handleResponseSubmit(review.id, response)}
          />
        ))}

        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => loadReviews()}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Carregar mais'}
            </Button>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma avaliação encontrada.
          </div>
        )}
      </div>
    </div>
  );
} 