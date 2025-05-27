import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

// Tipos
interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  cpf?: string;
  specialties: string[];
  commissionRate?: number;
  status: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
  location?: {
    city: string;
    state: string;
    fullAddress: string;
  };
  workingHours?: Record<string, {
    isAvailable: boolean;
    startTime: string;
    endTime: string;
  }>;
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution?: Record<number, number>;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer: {
      name: string;
      avatar?: string;
    };
  }>;
  createdAt: string;
}

interface ProfessionalsResponse {
  data: Professional[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ProfessionalFilters {
  page?: number;
  limit?: number;
  search?: string;
  specialty?: string;
  location?: string;
  status?: string;
}

// API Functions
async function fetchProfessionals(filters: ProfessionalFilters = {}): Promise<ProfessionalsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/professionals?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar profissionais: ${response.status}`);
  }
  
  return response.json();
}

async function fetchProfessional(id: string): Promise<{ data: Professional }> {
  const response = await fetch(`/api/professionals/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Profissional não encontrado');
    }
    throw new Error(`Erro ao buscar profissional: ${response.status}`);
  }
  
  return response.json();
}

async function fetchProfessionalReviews(id: string, filters: { page?: number; limit?: number; rating?: string } = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/professionals/${id}/reviews?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar avaliações: ${response.status}`);
  }
  
  return response.json();
}

// Hooks
export function useProfessionals(
  filters: ProfessionalFilters = {},
  options?: Omit<UseQueryOptions<ProfessionalsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.professionals.list(filters),
    queryFn: () => fetchProfessionals(filters),
    ...options,
  });
}

export function useProfessional(
  id: string,
  options?: Omit<UseQueryOptions<{ data: Professional }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.professionals.detail(id),
    queryFn: () => fetchProfessional(id),
    enabled: !!id,
    ...options,
  });
}

export function useProfessionalReviews(
  id: string,
  filters: { page?: number; limit?: number; rating?: string } = {},
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.professionals.reviews(id), filters],
    queryFn: () => fetchProfessionalReviews(id, filters),
    enabled: !!id,
    ...options,
  });
} 