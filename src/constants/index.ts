export const APP_CONFIG = {
  name: 'Contratto',
  description: 'Encontre as melhores empresas de serviços para suas necessidades',
  version: '1.0.0',
} as const;

export const SERVICE_CATEGORIES = [
  {
    id: 'residencial',
    name: 'Empresas de Serviços Residenciais',
    description: 'Empresas especializadas em serviços para sua casa',
    icon: '🏠',
    examples: ['Limpeza', 'Pintura', 'Reforma', 'Jardinagem', 'Dedetização'],
  },
  {
    id: 'profissional',
    name: 'Empresas de Serviços Profissionais',
    description: 'Empresas de consultoria e serviços especializados',
    icon: '💼',
    examples: ['Contabilidade', 'Advocacia', 'Marketing', 'TI', 'Consultoria'],
  },
  {
    id: 'beleza',
    name: 'Empresas de Beleza & Estética',
    description: 'Salões, clínicas e centros de estética',
    icon: '💇',
    examples: ['Salões de Beleza', 'Barbearias', 'Clínicas de Estética', 'Spa', 'Manicure'],
  },
  {
    id: 'assistencia-tecnica',
    name: 'Empresas de Assistência Técnica',
    description: 'Empresas de reparo e manutenção de equipamentos',
    icon: '🔧',
    examples: ['Eletrodomésticos', 'Computadores', 'Celulares', 'Ar Condicionado', 'Eletrônicos'],
  },
  {
    id: 'pets',
    name: 'Empresas de Serviços para Pets',
    description: 'Pet shops e clínicas veterinárias',
    icon: '🐾',
    examples: ['Banho e Tosa', 'Veterinária', 'Hotel', 'Adestramento', 'Pet Shop'],
  },
] as const;

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  companies: {
    list: '/api/companies',
    detail: (id: string) => `/api/companies/${id}`,
    create: '/api/companies',
    update: (id: string) => `/api/companies/${id}`,
    delete: (id: string) => `/api/companies/${id}`,
    services: (id: string) => `/api/companies/${id}/services`,
    reviews: (id: string) => `/api/companies/${id}/reviews`,
  },
  services: {
    list: (companyId: string) => `/api/companies/${companyId}/services`,
    detail: (companyId: string, serviceId: string) => 
      `/api/companies/${companyId}/services/${serviceId}`,
    create: (companyId: string) => `/api/companies/${companyId}/services`,
    update: (companyId: string, serviceId: string) => 
      `/api/companies/${companyId}/services/${serviceId}`,
    delete: (companyId: string, serviceId: string) => 
      `/api/companies/${companyId}/services/${serviceId}`,
  },
  appointments: {
    list: '/api/appointments',
    create: '/api/appointments',
    update: (id: string) => `/api/appointments/${id}`,
    cancel: (id: string) => `/api/appointments/${id}/cancel`,
    complete: (id: string) => `/api/appointments/${id}/complete`,
  },
} as const;

export const THEME = {
  colors: {
    primary: '#d91e25',
    secondary: '#ff4d4f',
    background: '#ffffff',
    text: '#1f2937',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    status: {
      pending: '#faad14',
      confirmed: '#52c41a',
      in_progress: '#1890ff',
      completed: '#52c41a',
      cancelled: '#ff4d4f',
    },
  },
  fonts: {
    heading: 'iFoodRCTitulos',
    body: 'iFoodRCTextos',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const; 