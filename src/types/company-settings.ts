export interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: string[];
  };
  sms: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: string[];
  };
  whatsapp: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: string[];
  };
}

export interface BusinessHours {
  weekdays: {
    start: string;
    end: string;
    enabled: boolean;
  };
  saturday: {
    start: string;
    end: string;
    enabled: boolean;
  };
  sunday: {
    start: string;
    end: string;
    enabled: boolean;
  };
  holidays: {
    enabled: boolean;
  };
  exceptions: Array<{
    date: string;
    start?: string;
    end?: string;
    closed: boolean;
    description?: string;
  }>;
}

export interface CompanySettings {
  id: string;
  user_id: string;
  
  // Informações básicas
  cnpj: string | null;
  razao_social: string | null;
  inscricao_estadual: string | null;
  responsible_name: string | null;
  responsible_cpf: string | null;
  logo_url: string | null;
  website: string | null;
  description: string | null;

  // Endereço
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip_code: string | null;

  // Contato
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;

  // Configurações
  notification_settings: NotificationSettings;
  business_hours: BusinessHours;

  created_at: string;
  updated_at: string;
} 