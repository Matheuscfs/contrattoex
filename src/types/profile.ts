export type UserRole = 'customer' | 'professional' | 'business' | 'admin';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Certification {
  name: string;
  institution: string;
  year: string;
}

export interface ProfessionalInfo {
  specialties: string[];
  experience: number;
  education: Education[];
  certifications: Certification[];
}

export interface ServicesInfo {
  categories: string[];
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  serviceArea: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Documents {
  cpf?: string;
  professionalRegister?: string;
  criminalRecord?: string;
}

export interface CompanyInfo {
  cnpj: string;
  razaoSocial: string;
  inscricaoEstadual?: string;
  responsibleName: string;
  responsibleCpf: string;
}

export interface BusinessHours {
  weekdays: {
    start: string;
    end: string;
    lunch?: {
      start: string;
      end: string;
    };
  };
  weekend?: {
    start: string;
    end: string;
    lunch?: {
      start: string;
      end: string;
    };
  };
  holidays?: {
    isOpen: boolean;
    customHours?: {
      start: string;
      end: string;
    };
  };
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  address: Address | null;
  professional_info: ProfessionalInfo | null;
  services_info: ServicesInfo | null;
  portfolio: PortfolioItem[];
  documents: Documents | null;
  document_status: DocumentStatus;
  company_info: CompanyInfo | null;
  business_hours: BusinessHours | null;
  bio: string | null;
  website: string | null;
  social_media: SocialMedia | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdateInput = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>; 