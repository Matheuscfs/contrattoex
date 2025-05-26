import { Database } from './supabase';
import { User } from './user';
import { Company } from './company';
import { CompanyService } from './service';
import { Professional } from './professional';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  user_id: string;
  user?: User;
  service_id: string;
  service?: CompanyService;
  professional_id?: string | null;
  professional?: Professional;
  company_id: string;
  company?: Company;
  rating: number;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  response_comment?: string | null;
  response_date?: string | null;
  created_at: string;
  updated_at: string;
}

export type ReviewWithRelations = Review & {
  user: User;
  service: CompanyService;
  professional?: Professional;
  company: Company;
}

export type ReviewInput = Pick<Review, 
  'service_id' | 
  'professional_id' | 
  'company_id' | 
  'rating' | 
  'comment' | 
  'images'
>;

export type ReviewResponse = Pick<Review,
  'response_comment'
>;

// Tipos para queries
export interface ReviewFilters {
  user_id?: string;
  service_id?: string;
  professional_id?: string;
  company_id?: string;
  status?: ReviewStatus;
  rating?: number;
  date_from?: string;
  date_to?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
} 