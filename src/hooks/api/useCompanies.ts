import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

// Tipos
interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  rating: number;
  total_reviews: number;
  categories: string[];
  address?: {
    city: string;
    state: string;
    fullAddress: string;
  };
  contact?: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    is_closed: boolean;
  }>;
  services?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
  stats?: {
    totalReviews: number;
    averageRating: number;
    totalServices: number;
  };
}

interface CompaniesResponse {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

// API Functions
async function fetchCompanies(filters: CompanyFilters = {}): Promise<CompaniesResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/companies?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar empresas: ${response.status}`);
  }
  
  return response.json();
}

async function fetchCompany(id: string): Promise<{ data: Company }> {
  const response = await fetch(`/api/companies/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Empresa não encontrada');
    }
    throw new Error(`Erro ao buscar empresa: ${response.status}`);
  }
  
  return response.json();
}

async function fetchCompanyServices(id: string, filters: { page?: number; limit?: number; category?: string } = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/companies/${id}/services?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar serviços: ${response.status}`);
  }
  
  return response.json();
}

async function fetchCompanyReviews(id: string, filters: { page?: number; limit?: number; rating?: string } = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/companies/${id}/reviews?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar avaliações: ${response.status}`);
  }
  
  return response.json();
}

// Hooks
export function useCompanies(
  filters: CompanyFilters = {},
  options?: Omit<UseQueryOptions<CompaniesResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.companies.list(filters),
    queryFn: () => fetchCompanies(filters),
    ...options,
  });
}

export function useCompany(
  id: string,
  options?: Omit<UseQueryOptions<{ data: Company }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => fetchCompany(id),
    enabled: !!id,
    ...options,
  });
}

export function useCompanyServices(
  id: string,
  filters: { page?: number; limit?: number; category?: string } = {},
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.companies.services(id), filters],
    queryFn: () => fetchCompanyServices(id, filters),
    enabled: !!id,
    ...options,
  });
}

export function useCompanyReviews(
  id: string,
  filters: { page?: number; limit?: number; rating?: string } = {},
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.companies.reviews(id), filters],
    queryFn: () => fetchCompanyReviews(id, filters),
    enabled: !!id,
    ...options,
  });
} 