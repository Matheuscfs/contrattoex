'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ProfessionalFilters } from './ProfessionalFilters';
import type { ServiceCategory } from '@/types';

interface ClientProfessionalFiltersProps {
  initialFilters: {
    search: string;
    categories: ServiceCategory[];
    rating: number | null;
    city?: string;
    state?: string;
  };
}

export function ClientProfessionalFilters({ initialFilters }: ClientProfessionalFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFiltersChange = (filters: typeof initialFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    // Atualiza os parâmetros da URL
    if (filters.search) {
      params.set('q', filters.search);
    } else {
      params.delete('q');
    }

    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    } else {
      params.delete('categories');
    }

    if (filters.rating !== null) {
      params.set('rating', filters.rating.toString());
    } else {
      params.delete('rating');
    }

    if (filters.city) {
      params.set('city', filters.city);
    } else {
      params.delete('city');
    }

    if (filters.state) {
      params.set('state', filters.state);
    } else {
      params.delete('state');
    }

    // Atualiza a URL mantendo o path atual
    router.push(`/profissionais?${params.toString()}`);
  };

  return (
    <ProfessionalFilters
      initialFilters={initialFilters}
      onFiltersChange={handleFiltersChange}
    />
  );
} 