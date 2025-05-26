export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: 'customer' | 'professional' | 'business' | 'admin';
  created_at: string;
  updated_at: string;
} 