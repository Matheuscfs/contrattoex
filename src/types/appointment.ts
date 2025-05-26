import { User } from './user';
import { Company } from './company';
import { CompanyService } from './service';

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