import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FeaturedProfessional {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  highlight_text: string;
  badge_color: string;
  display_order: number;
  active: boolean;
  starts_at: string;
  ends_at: string | null;
  profile: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    specialties: string[];
    city: string | null;
    state: string | null;
    verified: boolean;
    phone: string | null;
  };
  stats?: {
    total_reviews: number;
    average_rating: number;
    total_services: number;
    response_time: number;
  };
}

interface FeaturedProfessionalsResponse {
  data: FeaturedProfessional[];
  total: number;
}

interface CreateFeaturedProfessionalData {
  profile_id: string;
  title: string;
  description: string;
  highlight_text: string;
  badge_color?: string;
  display_order?: number;
  starts_at?: string;
  ends_at?: string;
}

const fetchFeaturedProfessionals = async (
  limit: number = 6,
  includeStats: boolean = true
): Promise<FeaturedProfessionalsResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    include_stats: includeStats.toString()
  });

  const response = await fetch(`/api/featured-professionals?${params}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar profissionais em destaque');
  }
  
  return response.json();
};

const createFeaturedProfessional = async (
  data: CreateFeaturedProfessionalData
): Promise<{ data: FeaturedProfessional }> => {
  const response = await fetch('/api/featured-professionals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar destaque');
  }

  return response.json();
};

export function useFeaturedProfessionals(
  limit: number = 6,
  includeStats: boolean = true
) {
  return useQuery({
    queryKey: ['featured-professionals', limit, includeStats],
    queryFn: () => fetchFeaturedProfessionals(limit, includeStats),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCreateFeaturedProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeaturedProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-professionals'] });
    },
  });
} 