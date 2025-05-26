import { ServiceCategory } from './categories';

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

export interface ServiceVariation {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface PackageOption {
  id: string;
  name: string;
  services: string[]; // IDs dos serviços inclusos
  price: number;
  discount: number;
  description?: string;
}

export interface TimeDiscountRule {
  type: 'time';
  value: number; // porcentagem de desconto
  startTime: string; // formato HH:mm
  endTime: string;
}

export interface QuantityDiscountRule {
  type: 'quantity';
  value: number; // porcentagem de desconto
  minQuantity: number;
  maxQuantity: number;
}

export interface PackageDiscountRule {
  type: 'package';
  value: number; // porcentagem de desconto
  packageId: string;
}

export type DiscountRule = TimeDiscountRule | QuantityDiscountRule | PackageDiscountRule;

export interface DiscountRules {
  time?: TimeDiscountRule;
  quantity?: QuantityDiscountRule;
  package?: PackageDiscountRule;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // em minutos
  category?: string;
  subcategory?: string;
  images?: string[];
  tags?: string[];
  is_active: boolean;
  variations?: ServiceVariation[];
  package_options?: PackageOption[];
  discount_rules: DiscountRules;
  created_at?: string;
  updated_at?: string;
}

export type ServiceCreateInput = Omit<Service, 'id' | 'created_at' | 'updated_at'>;
export type ServiceUpdateInput = Partial<ServiceCreateInput>; 