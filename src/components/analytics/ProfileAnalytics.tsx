'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { MapPin, Briefcase, Award } from 'lucide-react';

interface AnalyticsData {
  requestsByPeriod: {
    period: string;
    requests: number;
  }[];
  clientsByState: {
    state: string;
    clients: number;
  }[];
  profileViews: {
    date: string;
    views: number;
  }[];
  serviceViews: {
    service: string;
    views: number;
  }[];
}

interface ProfileInfo {
  name: string;
  occupation: string;
  location: string;
  experience: string;
  specialties: string[];
  certifications: {
    name: string;
    institution: string;
    year: string;
  }[];
  imageUrl: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockData: AnalyticsData = {
  requestsByPeriod: [
    { period: 'Jan', requests: 65 },
    { period: 'Fev', requests: 80 },
    { period: 'Mar', requests: 95 },
    { period: 'Abr', requests: 75 },
    { period: 'Mai', requests: 85 },
    { period: 'Jun', requests: 100 }
  ],
  clientsByState: [
    { state: 'SP', clients: 45 },
    { state: 'RJ', clients: 25 },
    { state: 'MG', clients: 20 },
    { state: 'PR', clients: 15 },
    { state: 'SC', clients: 10 }
  ],
  profileViews: [
    { date: '01/03', views: 120 },
    { date: '02/03', views: 150 },
    { date: '03/03', views: 180 },
    { date: '04/03', views: 140 },
    { date: '05/03', views: 160 },
    { date: '06/03', views: 200 }
  ],
  serviceViews: [
    { service: 'Instalação Elétrica', views: 250 },
    { service: 'Manutenção', views: 180 },
    { service: 'Projeto Elétrico', views: 120 },
    { service: 'Automação', views: 90 }
  ]
};

const mockProfileInfo: ProfileInfo = {
  name: 'Pedro Santos',
  occupation: 'Instalações Elétricas',
  location: 'São Paulo, SP',
  experience: '15 anos de experiência',
  specialties: ['Instalações Elétricas', 'Manutenção Preventiva', 'Projetos Elétricos'],
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
  imageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60'
};

export function ProfileAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
      {/* Card de Informações Básicas */}
      <div className="md:col-span-1 space-y-4 md:space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={mockProfileInfo.imageUrl}
                  alt={mockProfileInfo.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-center">{mockProfileInfo.name}</h2>
              <p className="text-sm text-gray-500 text-center">{mockProfileInfo.occupation}</p>
              
              <div className="mt-4 w-full space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{mockProfileInfo.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{mockProfileInfo.experience}</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <h3 className="text-sm font-medium mb-2">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProfileInfo.specialties.map((specialty, index) => (
                    <div
                      key={index}
                      className="text-xs lg:text-sm text-gray-600 bg-gray-100 px-2 lg:px-3 py-1 rounded-full truncate"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 w-full">
                <h3 className="text-sm font-medium mb-2">Certificações</h3>
                <div className="space-y-2 lg:space-y-3">
                  {mockProfileInfo.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-2 lg:p-3"
                    >
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{cert.name}</p>
                          <p className="text-xs text-gray-500 truncate">{cert.institution} • {cert.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Gráficos */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Analytics do Perfil</CardTitle>
            <CardDescription>
              Estatísticas e métricas do seu perfil e serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Gráfico de Solicitações por Período */}
              <Card className="shadow-sm">
                <CardHeader className="p-3 md:p-4">
                  <CardTitle className="text-base md:text-lg">Solicitações por Período</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <div className="h-[200px] md:h-[250px] lg:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.requestsByPeriod}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="requests" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Clientes por Estado */}
              <Card className="shadow-sm">
                <CardHeader className="p-3 md:p-4">
                  <CardTitle className="text-base md:text-lg">Clientes por Estado</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <div className="h-[200px] md:h-[250px] lg:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.clientsByState}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="clients"
                          nameKey="state"
                        >
                          {mockData.clientsByState.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Visualizações do Perfil */}
              <Card className="shadow-sm">
                <CardHeader className="p-3 md:p-4">
                  <CardTitle className="text-base md:text-lg">Visualizações do Perfil</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <div className="h-[200px] md:h-[250px] lg:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.profileViews}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#8884d8"
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Visualizações por Serviço */}
              <Card className="shadow-sm">
                <CardHeader className="p-3 md:p-4">
                  <CardTitle className="text-base md:text-lg">Visualizações por Serviço</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <div className="h-[200px] md:h-[250px] lg:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockData.serviceViews}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis 
                          dataKey="service" 
                          type="category" 
                          width={100} 
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip />
                        <Bar dataKey="views" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 