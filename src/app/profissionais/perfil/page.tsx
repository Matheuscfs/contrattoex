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
  User,
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
  Award,
  FileText,
  WrenchIcon
} from 'lucide-react';
import { maskCPF, maskPhone, maskCEP } from '@/utils/masks';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceManagement } from '@/components/services/ServiceManagement';
import { ProfileAnalytics } from '@/components/analytics/ProfileAnalytics';

interface ProfessionalProfile {
  personalInfo: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birthDate: string;
    bio: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      linkedin?: string;
    };
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
  professional: {
    specialties: string[];
    experience: number; // anos de experiência
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    certifications: {
      name: string;
      institution: string;
      year: string;
    }[];
    portfolio: {
      title: string;
      description: string;
      imageUrl: string;
    }[];
  };
  services: {
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
  };
  documents: {
    cpfFile?: File;
    professionalRegister?: File;
    criminalRecord?: File;
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

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60');
  
  const [profile, setProfile] = useState<ProfessionalProfile>({
    personalInfo: {
      name: 'Pedro Santos',
      cpf: '123.456.789-00',
      email: 'pedro.santos@email.com',
      phone: '(11) 98765-4321',
      birthDate: '1985-06-15',
      bio: 'Eletricista profissional com mais de 15 anos de experiência em instalações residenciais e comerciais.',
      website: 'www.eletricistapedro.com.br',
      socialMedia: {
        instagram: '@eletricista.pedro',
        linkedin: 'pedrosantos'
      },
      address: {
        street: 'Rua dos Técnicos',
        number: '456',
        complement: 'Casa',
        neighborhood: 'Vila Profissional',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04567-000'
      }
    },
    professional: {
      specialties: ['Instalações Elétricas', 'Manutenção Preventiva', 'Projetos Elétricos'],
      experience: 15,
      education: [
        {
          degree: 'Técnico em Eletrotécnica',
          institution: 'SENAI',
          year: '2008'
        }
      ],
      certifications: [
        {
          name: 'NR-10',
          institution: 'SENAI',
          year: '2023'
        },
        {
          name: 'Instalações Elétricas Prediais',
          institution: 'CREA',
          year: '2022'
        }
      ],
      portfolio: [
        {
          title: 'Instalação Comercial',
          description: 'Projeto completo de instalação elétrica para loja de departamentos',
          imageUrl: '/portfolio-1.jpg'
        },
        {
          title: 'Reforma Residencial',
          description: 'Atualização do sistema elétrico de residência',
          imageUrl: '/portfolio-2.jpg'
        }
      ]
    },
    services: {
      categories: ['Instalações Elétricas', 'Manutenção', 'Projetos'],
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      serviceArea: ['São Paulo', 'Guarulhos', 'ABC'],
      priceRange: {
        min: 100,
        max: 500
      }
    },
    documents: {}
  });

  const reviews: ServiceReview[] = [
    {
      id: '1',
      clientName: 'Roberto Silva',
      rating: 5,
      comment: 'Excelente profissional, muito pontual e organizado.',
      date: '2024-03-15',
      service: 'Instalação Elétrica'
    },
    {
      id: '2',
      clientName: 'Ana Paula',
      rating: 4.8,
      comment: 'Fez um ótimo trabalho na manutenção da rede elétrica.',
      date: '2024-03-10',
      service: 'Manutenção Preventiva'
    }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'personalInfo' | 'address',
    field: string
  ) => {
    const { value } = e.target;
    let maskedValue = value;

    if (field === 'cpf') {
      maskedValue = maskCPF(value);
    } else if (field === 'phone') {
      maskedValue = maskPhone(value);
    } else if (field === 'zipCode') {
      maskedValue = maskCEP(value);
    }

    if (section === 'address') {
      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          address: {
            ...prev.personalInfo.address,
            [field]: maskedValue
          }
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: maskedValue
        }
      }));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Perfil Profissional</h1>
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
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Seus dados cadastrais</CardDescription>
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
              <div>
                <Label>Sobre mim</Label>
                <textarea
                  value={profile.personalInfo.bio}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      bio: e.target.value
                    }
                  }))}
                  disabled={!isEditing}
                  className="w-full min-h-[100px] p-2 border rounded-md mt-1 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.personalInfo.name}
                    onChange={(e) => handleInputChange(e, 'personalInfo', 'name')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={profile.personalInfo.cpf}
                    onChange={(e) => handleInputChange(e, 'personalInfo', 'cpf')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleInputChange(e, 'personalInfo', 'email')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleInputChange(e, 'personalInfo', 'phone')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.personalInfo.website}
                    onChange={(e) => handleInputChange(e, 'personalInfo', 'website')}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.personalInfo.socialMedia?.instagram}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        socialMedia: {
                          ...prev.personalInfo.socialMedia,
                          instagram: e.target.value
                        }
                      }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={profile.personalInfo.address.street}
                      onChange={(e) => handleInputChange(e, 'address', 'street')}
                      disabled={!isEditing}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={profile.personalInfo.address.number}
                        onChange={(e) => handleInputChange(e, 'address', 'number')}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={profile.personalInfo.address.complement}
                        onChange={(e) => handleInputChange(e, 'address', 'complement')}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={profile.personalInfo.address.neighborhood}
                      onChange={(e) => handleInputChange(e, 'address', 'neighborhood')}
                      disabled={!isEditing}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profile.personalInfo.address.city}
                      onChange={(e) => handleInputChange(e, 'address', 'city')}
                      disabled={!isEditing}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profile.personalInfo.address.state}
                      onChange={(e) => handleInputChange(e, 'address', 'state')}
                      disabled={!isEditing}
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/3">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={profile.personalInfo.address.zipCode}
                    onChange={(e) => handleInputChange(e, 'address', 'zipCode')}
                    disabled={!isEditing}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações de Clientes</CardTitle>
              <CardDescription>Feedback dos serviços prestados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base">{review.clientName}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{review.comment}</p>
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