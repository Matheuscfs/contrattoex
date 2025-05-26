import { API_ROUTES } from '@/constants';
import type { 
  User, 
  Company,
  CompanyService, 
  Review, 
  Appointment 
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI<{ user: User; token: string }>(API_ROUTES.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (userData: Partial<User>) =>
      fetchAPI<{ user: User; token: string }>(API_ROUTES.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: () =>
      fetchAPI(API_ROUTES.auth.logout, {
        method: 'POST',
      }),
  },
  companies: {
    list: (params?: URLSearchParams) =>
      fetchAPI<Company[]>(`${API_ROUTES.companies.list}?${params?.toString() || ''}`),
    getById: (id: string) =>
      fetchAPI<Company>(API_ROUTES.companies.detail(id)),
    create: (companyData: Partial<Company>) =>
      fetchAPI<Company>(API_ROUTES.companies.create, {
        method: 'POST',
        body: JSON.stringify(companyData),
      }),
    update: (id: string, companyData: Partial<Company>) =>
      fetchAPI<Company>(API_ROUTES.companies.update(id), {
        method: 'PUT',
        body: JSON.stringify(companyData),
      }),
    delete: (id: string) =>
      fetchAPI(API_ROUTES.companies.delete(id), {
        method: 'DELETE',
      }),
    getServices: (id: string) =>
      fetchAPI<CompanyService[]>(API_ROUTES.companies.services(id)),
    getReviews: (id: string) =>
      fetchAPI<Review[]>(API_ROUTES.companies.reviews(id)),
  },
  services: {
    list: (companyId: string, params?: URLSearchParams) =>
      fetchAPI<CompanyService[]>(`${API_ROUTES.services.list(companyId)}?${params?.toString() || ''}`),
    getById: (companyId: string, serviceId: string) =>
      fetchAPI<CompanyService>(API_ROUTES.services.detail(companyId, serviceId)),
    create: (companyId: string, serviceData: Partial<CompanyService>) =>
      fetchAPI<CompanyService>(API_ROUTES.services.create(companyId), {
        method: 'POST',
        body: JSON.stringify(serviceData),
      }),
    update: (companyId: string, serviceId: string, serviceData: Partial<CompanyService>) =>
      fetchAPI<CompanyService>(API_ROUTES.services.update(companyId, serviceId), {
        method: 'PUT',
        body: JSON.stringify(serviceData),
      }),
    delete: (companyId: string, serviceId: string) =>
      fetchAPI(API_ROUTES.services.delete(companyId, serviceId), {
        method: 'DELETE',
      }),
  },
  appointments: {
    list: (params?: URLSearchParams) =>
      fetchAPI<Appointment[]>(`${API_ROUTES.appointments.list}?${params?.toString() || ''}`),
    create: (appointmentData: Partial<Appointment>) =>
      fetchAPI<Appointment>(API_ROUTES.appointments.create, {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      }),
    update: (id: string, appointmentData: Partial<Appointment>) =>
      fetchAPI<Appointment>(API_ROUTES.appointments.update(id), {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      }),
    cancel: (id: string) =>
      fetchAPI<Appointment>(API_ROUTES.appointments.cancel(id), {
        method: 'POST',
      }),
    complete: (id: string) =>
      fetchAPI<Appointment>(API_ROUTES.appointments.complete(id), {
        method: 'POST',
      }),
  },
}; 