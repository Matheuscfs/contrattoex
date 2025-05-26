'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
import { Building2, User, Upload, ArrowLeft, Clock, Mail, Lock } from 'lucide-react';
import { maskCNPJ, maskCPF, maskPhone, maskCEP } from '@/utils/masks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

interface CompanyRegistrationForm {
  // Dados da empresa
  companyName: string;
  tradingName: string;
  cnpj: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Dados do sócio administrador
  administrator: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    birthDate: string;
  };
  // Tipo de serviço
  services: {
    categories: string[];
    description: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
  };
  // Credenciais da conta
  account: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  // Documento CNPJ
  cnpjFile?: File;
}

type FormSection = keyof CompanyRegistrationForm;
type AddressFields = keyof CompanyRegistrationForm['address'];
type AdministratorFields = keyof CompanyRegistrationForm['administrator'];

export default function CompanyRegistrationPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyRegistrationForm>({
    companyName: '',
    tradingName: '',
    cnpj: '',
    phone: '',
    email: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    administrator: {
      name: '',
      cpf: '',
      phone: '',
      email: '',
      birthDate: ''
    },
    services: {
      categories: [],
      description: '',
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      workingDays: []
    },
    account: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const updateFormData = (
    value: string,
    field: string,
    section?: 'address' | 'administrator' | 'services' | 'account'
  ) => {
    let maskedValue = value;

    // Aplica máscaras conforme o campo
    if (field === 'cnpj') {
      maskedValue = maskCNPJ(value);
    } else if (field === 'cpf') {
      maskedValue = maskCPF(value);
    } else if (field === 'phone') {
      maskedValue = maskPhone(value);
    } else if (field === 'zipCode') {
      maskedValue = maskCEP(value);
    }

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: maskedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: maskedValue,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: 'address' | 'administrator' | 'services' | 'account'
  ) => {
    const { name, value } = e.target;
    updateFormData(value, name, section);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cnpjFile: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de envio do formulário
    console.log('Dados do formulário:', formData);
  };

  const serviceCategories = [
    'Limpeza',
    'Manutenção',
    'Reformas',
    'Instalações',
    'Pintura',
    'Jardinagem',
    'Segurança',
    'Eventos',
    'Outros'
  ];

  const weekDays = [
    { value: 'sunday', label: 'Domingo' },
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' }
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        categories: checked
          ? [...prev.services.categories, category]
          : prev.services.categories.filter(c => c !== category)
      }
    }));
  };

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        workingDays: checked
          ? [...prev.services.workingDays, day]
          : prev.services.workingDays.filter(d => d !== day)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastro de Empresa</h1>
            <p className="text-sm text-gray-500">
              Preencha os dados abaixo para cadastrar sua empresa na plataforma
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Seção 1: Dados da Empresa */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>Dados da Empresa</CardTitle>
              </div>
              <CardDescription>
                Informações básicas sobre a empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Razão Social da empresa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tradingName">Nome Fantasia</Label>
                  <Input
                    id="tradingName"
                    name="tradingName"
                    value={formData.tradingName}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Nome Fantasia da empresa"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="email@empresa.com"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address.street">Rua</Label>
                    <Input
                      id="address.street"
                      name="street"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange(e, 'address')}
                      placeholder="Nome da rua"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address.number">Número</Label>
                      <Input
                        id="address.number"
                        name="number"
                        value={formData.address.number}
                        onChange={(e) => handleInputChange(e, 'address')}
                        placeholder="Nº"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address.complement">Complemento</Label>
                      <Input
                        id="address.complement"
                        name="complement"
                        value={formData.address.complement}
                        onChange={(e) => handleInputChange(e, 'address')}
                        placeholder="Complemento"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address.neighborhood">Bairro</Label>
                    <Input
                      id="address.neighborhood"
                      name="neighborhood"
                      value={formData.address.neighborhood}
                      onChange={(e) => handleInputChange(e, 'address')}
                      placeholder="Bairro"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address.city">Cidade</Label>
                    <Input
                      id="address.city"
                      name="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange(e, 'address')}
                      placeholder="Cidade"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address.state">Estado</Label>
                    <Input
                      id="address.state"
                      name="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange(e, 'address')}
                      placeholder="Estado"
                      required
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <Label htmlFor="address.zipCode">CEP</Label>
                  <Input
                    id="address.zipCode"
                    name="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange(e, 'address')}
                    placeholder="00000-000"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Dados do Sócio Administrador */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Dados do Sócio Administrador</CardTitle>
              </div>
              <CardDescription>
                Informações do responsável legal pela empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="administrator.name">Nome Completo</Label>
                <Input
                  id="administrator.name"
                  name="name"
                  value={formData.administrator.name}
                  onChange={(e) => handleInputChange(e, 'administrator')}
                  placeholder="Nome completo do sócio administrador"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="administrator.cpf">CPF</Label>
                  <Input
                    id="administrator.cpf"
                    name="cpf"
                    value={formData.administrator.cpf}
                    onChange={(e) => handleInputChange(e, 'administrator')}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="administrator.birthDate">Data de Nascimento</Label>
                  <Input
                    id="administrator.birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.administrator.birthDate}
                    onChange={(e) => handleInputChange(e, 'administrator')}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="administrator.phone">Telefone</Label>
                  <Input
                    id="administrator.phone"
                    name="phone"
                    value={formData.administrator.phone}
                    onChange={(e) => handleInputChange(e, 'administrator')}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="administrator.email">E-mail</Label>
                  <Input
                    id="administrator.email"
                    name="email"
                    type="email"
                    value={formData.administrator.email}
                    onChange={(e) => handleInputChange(e, 'administrator')}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Upload do CNPJ */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <CardTitle>Documento CNPJ</CardTitle>
              </div>
              <CardDescription>
                Anexe o comprovante de CNPJ da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Arraste e solte o arquivo aqui ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    id="cnpjFile"
                    name="cnpjFile"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('cnpjFile')?.click()}
                  >
                    Selecionar arquivo
                  </Button>
                  {formData.cnpjFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      Arquivo selecionado: {formData.cnpjFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nova Seção: Tipo de Serviço */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle>Tipo de Serviço</CardTitle>
              </div>
              <CardDescription>
                Informações sobre os serviços oferecidos e horário de funcionamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Categorias de Serviço</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {serviceCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={formData.services.categories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="services.description">Descrição dos Serviços</Label>
                <textarea
                  id="services.description"
                  name="description"
                  value={formData.services.description}
                  onChange={(e) => updateFormData(e.target.value, 'description', 'services')}
                  placeholder="Descreva os tipos de serviços oferecidos..."
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <Label>Dias de Funcionamento</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {weekDays.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={formData.services.workingDays.includes(day.value)}
                        onCheckedChange={(checked) => handleWorkingDayChange(day.value, checked)}
                      />
                      <label
                        htmlFor={`day-${day.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="services.workingHours.start">Horário de Início</Label>
                  <Input
                    type="time"
                    id="services.workingHours.start"
                    name="start"
                    value={formData.services.workingHours.start}
                    onChange={(e) => updateFormData(e.target.value, 'start', 'services')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="services.workingHours.end">Horário de Término</Label>
                  <Input
                    type="time"
                    id="services.workingHours.end"
                    name="end"
                    value={formData.services.workingHours.end}
                    onChange={(e) => updateFormData(e.target.value, 'end', 'services')}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nova Seção: Credenciais da Conta */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Credenciais da Conta</CardTitle>
              </div>
              <CardDescription>
                Defina o e-mail e senha para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="account.email">E-mail da Conta</Label>
                <Input
                  id="account.email"
                  name="email"
                  type="email"
                  value={formData.account.email}
                  onChange={(e) => updateFormData(e.target.value, 'email', 'account')}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="account.password">Senha</Label>
                <div className="relative">
                  <Input
                    id="account.password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.account.password}
                    onChange={(e) => updateFormData(e.target.value, 'password', 'account')}
                    placeholder="Digite sua senha"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="account.confirmPassword">Confirme sua Senha</Label>
                <div className="relative">
                  <Input
                    id="account.confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.account.confirmPassword}
                    onChange={(e) => updateFormData(e.target.value, 'confirmPassword', 'account')}
                    placeholder="Confirme sua senha"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              Cadastrar Empresa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 