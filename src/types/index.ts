export * from './user';
export * from './company';
export * from './service';
export * from './review';
export * from './appointment';
export * from './categories';
export * from './filters';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'company' | 'admin';
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  categories: ServiceCategory[];
  services: CompanyService[];
  rating: number;
  reviews: Review[];
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  businessHours: {
    days: number[];
    hours: {
      open: string;
      close: string;
    };
  };
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  documents: {
    cnpj: string;
    inscricaoEstadual?: string;
  };
  owner: User;
  employees?: User[];
  createdAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface CompanyService {
  id: string;
  name: string;
  description: string;
  price: {
    value: number;
    unit: 'hour' | 'service' | 'custom';
    customDescription?: string;
  };
  estimatedDuration?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  category: ServiceCategory;
  images?: string[];
  isAvailable: boolean;
}

export interface Review {
  id: string;
  user: User;
  company: Company;
  service?: CompanyService;
  rating: number;
  comment: string;
  images?: string[];
  response?: {
    comment: string;
    createdAt: Date;
  };
  createdAt: Date;
}

export type ServiceCategory = 
  | 'residencial'
  | 'profissional'
  | 'beleza'
  | 'assistencia-tecnica'
  | 'pets';

export interface Appointment {
  id: string;
  company: Company;
  service: CompanyService;
  client: User;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  estimatedDuration: number;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'credit_card' | 'debit_card' | 'pix' | 'money';
  notes?: string;
  clientFeedback?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFilters {
  search: string;
  category: ServiceCategory | '';
  priceRange: {
    min: number;
    max: number;
  };
  availability: boolean | null;
} 