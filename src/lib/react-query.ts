import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 1000 * 60 * 5,
      // Manter cache por 10 minutos
      gcTime: 1000 * 60 * 10,
      // Retry automático em caso de erro
      retry: (failureCount, error: any) => {
        // Não fazer retry para erros 404 ou 403
        if (error?.status === 404 || error?.status === 403) {
          return false;
        }
        // Máximo 3 tentativas
        return failureCount < 3;
      },
      // Refetch quando a janela ganha foco
      refetchOnWindowFocus: false,
      // Refetch quando reconecta à internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automático para mutations
      retry: 1,
    },
  },
});

// Configurações específicas por tipo de query
export const queryKeys = {
  // Empresas
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.companies.lists(), filters] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const,
    services: (id: string) => [...queryKeys.companies.detail(id), 'services'] as const,
    reviews: (id: string) => [...queryKeys.companies.detail(id), 'reviews'] as const,
  },
  // Profissionais
  professionals: {
    all: ['professionals'] as const,
    lists: () => [...queryKeys.professionals.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.professionals.lists(), filters] as const,
    details: () => [...queryKeys.professionals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.professionals.details(), id] as const,
    reviews: (id: string) => [...queryKeys.professionals.detail(id), 'reviews'] as const,
  },
  // Serviços
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
} as const; 