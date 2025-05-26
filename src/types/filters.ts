import { ServiceCategory } from './categories';

export interface ServiceFilters {
  search: string;
  category: ServiceCategory | '';
  priceRange: {
    min: number;
    max: number;
  };
  availability: boolean | null;
} 