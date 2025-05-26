import { User } from './user';
import { CompanyService } from './service';
import { Review } from './review';
import { ServiceCategory } from './categories';

export interface Company {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  rating: number;
  total_reviews: number;
  categories: string[];
  is_open: boolean;
  distance?: number; // em km
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    website?: string;
    social_media?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  business_hours: {
    [key: string]: { // dia da semana em português
      open: string; // HH:mm
      close: string; // HH:mm
      is_closed: boolean;
    };
  };
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // em minutos
    category: string;
  }[];
  logo?: string;
  reviews: Review[];
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