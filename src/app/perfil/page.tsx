'use client';

import { useState, useEffect } from 'react';
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
  Camera
} from 'lucide-react';
import { maskCPF, maskPhone, maskCEP } from '@/utils/masks';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, Address } from '@/types/profile';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    subfield?: string
  ) => {
    const value = e.target.value;
    
    if (subfield) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof Profile] as any || {}),
          [subfield]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Address
  ) => {
    const currentAddress = formData.address || {} as Address;
    setFormData(prev => ({
      ...prev,
      address: {
        ...currentAddress,
        [field]: e.target.value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: Implementar upload de imagem para o Storage do Supabase
      // e atualizar o avatar_url no perfil
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Foto e Informações Básicas */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden relative">
                      <Image
                        src={profile.avatar_url || '/placeholder-avatar.png'}
                        alt="Foto de perfil"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover"
                      />
                    </div>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </label>
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Configure suas preferências de conta</CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Adicionar preferências do usuário */}
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Informações Detalhadas */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Seus dados cadastrais</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={maskCPF(formData.cpf || '')}
                      onChange={(e) => handleInputChange(e, 'cpf')}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange(e, 'email')}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={maskPhone(formData.phone || '')}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date || ''}
                    onChange={(e) => handleInputChange(e, 'birth_date')}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        value={formData.address?.street || ''}
                        onChange={(e) => handleAddressChange(e, 'street')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={formData.address?.number || ''}
                        onChange={(e) => handleAddressChange(e, 'number')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={formData.address?.complement || ''}
                        onChange={(e) => handleAddressChange(e, 'complement')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.address?.neighborhood || ''}
                        onChange={(e) => handleAddressChange(e, 'neighborhood')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.address?.city || ''}
                        onChange={(e) => handleAddressChange(e, 'city')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.address?.state || ''}
                        onChange={(e) => handleAddressChange(e, 'state')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={maskCEP(formData.address?.zipCode || '')}
                        onChange={(e) => handleAddressChange(e, 'zipCode')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 