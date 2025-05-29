'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  Award,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfessional } from '@/hooks/api/useProfessionals';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfessionalPageProps {
  params: {
    id: string;
  };
}

function ProfessionalSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { data: professionalData, isLoading, error } = useProfessional(params.id);
  const [isFavorited, setIsFavorited] = useState(false);

  if (isLoading) {
    return <ProfessionalSkeleton />;
  }

  if (error || !professionalData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profissional não encontrado
          </h1>
          <p className="text-gray-600 mb-4">
            O profissional que você está procurando não existe ou foi removido.
          </p>
          <Link href="/profissionais">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Profissionais
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const professional = professionalData.data;

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=400`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/profissionais">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? 'text-red-500' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                      <Image
                        src={professional.avatar || getAvatarUrl(professional.name)}
                        alt={professional.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {professional.status === 'approved' && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {professional.stats.averageRating >= 4.5 && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Award className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {professional.name}
                    </h1>
                    <p className="text-gray-600">
                      {professional.specialties[0] || 'Profissional'}
                    </p>
                  </div>

                  {professional.stats.totalReviews > 0 && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">
                          {professional.stats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        ({professional.stats.totalReviews} avaliações)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.location?.fullAddress || 'Localização não informada'}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>Disponível</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Button className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Serviço
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>

                <div className="space-y-3 mt-6 pt-6 border-t">
                  {professional.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{professional.phone}</span>
                    </div>
                  )}
                  {professional.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{professional.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="sobre" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="servicos">Serviços</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="sobre">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre o Profissional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {professional.email && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Profissional qualificado com experiência em {professional.specialties.join(', ')}.
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Especialidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {professional.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Estatísticas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {professional.stats.totalReviews}
                          </div>
                          <div className="text-sm text-gray-600">Avaliações</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {professional.stats.averageRating.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Nota Média</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="servicos">
                <Card>
                  <CardHeader>
                    <CardTitle>Serviços Oferecidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Informações sobre serviços serão implementadas em breve.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avaliacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações dos Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Sistema de avaliações será implementado em breve.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 