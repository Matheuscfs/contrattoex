import { useQuery } from '@tanstack/react-query';

interface Subcategory {
  id: string;
  name: string;
  count?: number;
}

interface Category {
  id: string;
  name: string;
  type: 'professional' | 'company';
  icon: string;
  description: string;
  subcategories: Subcategory[];
  count?: number;
}

interface CategoriesResponse {
  data: Category[];
  meta: {
    total: number;
    type: string;
    includeCount: boolean;
  };
}

interface UseCategoriesOptions {
  type?: 'professionals' | 'companies' | 'all';
  includeCount?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { type = 'all', includeCount = false } = options;
  
  return useQuery<CategoriesResponse>({
    queryKey: ['categories', type, includeCount],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type !== 'all') params.append('type', type);
      if (includeCount) params.append('includeCount', 'true');
      
      const response = await fetch(`/api/categories?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar categorias');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export type { Category, Subcategory, CategoriesResponse }; 