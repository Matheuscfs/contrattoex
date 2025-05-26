'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Building2,
  Settings,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Camera,
  Briefcase,
  Users,
  FileText
} from 'lucide-react';
import { maskCNPJ, maskPhone, maskCEP } from '@/utils/masks';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceManagement } from '@/components/services/ServiceManagement';
import { ProfileAnalytics } from '@/components/analytics/ProfileAnalytics';

interface CompanyProfile {
  companyInfo: {
    companyName: string;
    tradingName: string;
    cnpj: string;
    phone: string;
    email: string;
    description: string;
    foundedDate: string;
    website: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  services: {
    categories: string[];
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    serviceArea: string[];
  };
  team: {
    totalEmployees: number;
    specialties: string[];
  };
  documents: {
    cnpjFile?: File;
    insuranceFile?: File;
    certifications: string[];
  };
}

interface ServiceReview {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export default function CompanyProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [logoImage, setLogoImage] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60');
  
  const [profile, setProfile] = useState<CompanyProfile>({
    companyInfo: {
      companyName: 'Serviços Profissionais Ltda',
      tradingName: 'Pro Services',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 3456-7890',
      email: 'contato@proservices.com.br',
      description: 'Empresa especializada em serviços residenciais e comerciais com mais de 10 anos de experiência.',
      foundedDate: '2014-01-01',
      website: 'www.proservices.com.br',
      address: {
        street: 'Avenida Comercial',
        number: '1000',
        complement: 'Sala 505',
        neighborhood: 'Centro Empresarial',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04567-000'
      }
    },
    services: {
      categories: ['Limpeza', 'Manutenção', 'Reformas'],
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      serviceArea: ['São Paulo', 'Guarulhos', 'Santo André']
    },
    team: {
      totalEmployees: 25,
      specialties: ['Eletricista', 'Encanador', 'Pintor', 'Pedreiro']
    },
    documents: {
      certifications: ['ISO 9001', 'PBQP-H']
    }
  });

  const reviews: ServiceReview[] = [
    {
      id: '1',
      clientName: 'Maria Silva',
      rating: 5,
      comment: 'Excelente serviço de limpeza, equipe muito profissional.',
      date: '2024-03-10',
      service: 'Limpeza Residencial'
    },
    {
      id: '2',
      clientName: 'João Santos',
      rating: 4.5,
      comment: 'Ótimo trabalho na reforma do banheiro, apenas um pequeno atraso na entrega.',
      date: '2024-03-05',
      service: 'Reforma'
    }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'companyInfo' | 'address',
    field: string
  ) => {
    const { value } = e.target;
    let maskedValue = value;

    if (field === 'cnpj') {
      maskedValue = maskCNPJ(value);
    } else if (field === 'phone') {
      maskedValue = maskPhone(value);
    } else if (field === 'zipCode') {
      maskedValue = maskCEP(value);
    }

    if (section === 'address') {
      setProfile(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          address: {
            ...prev.companyInfo.address,
            [field]: maskedValue
          }
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          [field]: maskedValue
        }
      }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implementar lógica para salvar alterações
    console.log('Perfil atualizado:', profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1024px] mx-auto">
        <div className="flex items-center gap-4 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Perfil da Empresa</h1>
        </div>

        <div className="mb-4 sm:mb-6 md:mb-8">
          <ProfileAnalytics />
        </div>

        <div className="mb-4 sm:mb-6 md:mb-8">
          <ServiceManagement />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Informações Detalhadas e Avaliações */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 md:p-6">
              <div>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Dados cadastrais e informações gerais</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className="self-end sm:self-auto"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.companyInfo.email}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'email')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.companyInfo.phone}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'phone')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.companyInfo.website}
                  onChange={(e) => handleInputChange(e, 'companyInfo', 'website')}
                  disabled={!isEditing}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição da Empresa</Label>
                <textarea
                  id="description"
                  value={profile.companyInfo.description}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    companyInfo: {
                      ...prev.companyInfo,
                      description: e.target.value
                    }
                  }))}
                  disabled={!isEditing}
                  className="w-full min-h-[100px] p-2 border rounded-md text-sm"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={profile.companyInfo.address.street}
                      onChange={(e) => handleInputChange(e, 'address', 'street')}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={profile.companyInfo.address.number}
                        onChange={(e) => handleInputChange(e, 'address', 'number')}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={profile.companyInfo.address.complement}
                        onChange={(e) => handleInputChange(e, 'address', 'complement')}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={profile.companyInfo.address.neighborhood}
                      onChange={(e) => handleInputChange(e, 'address', 'neighborhood')}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profile.companyInfo.address.city}
                      onChange={(e) => handleInputChange(e, 'address', 'city')}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profile.companyInfo.address.state}
                      onChange={(e) => handleInputChange(e, 'address', 'state')}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/3">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={profile.companyInfo.address.zipCode}
                    onChange={(e) => handleInputChange(e, 'address', 'zipCode')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Avaliações de Clientes</CardTitle>
              <CardDescription>Feedback dos serviços prestados</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                      <div>
                        <h3 className="font-medium text-sm">{review.clientName}</h3>
                        <p className="text-xs text-gray-500">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 