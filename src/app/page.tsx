'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Star, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PromotionsSection } from '@/components/promotions/PromotionsSection';
import { HeroBanner } from "@/components/home/HeroBanner";
import { Categories } from "@/components/home/Categories";
import { useProfessionals } from '@/hooks/api/useProfessionals';

// Dados mockados para categorias de profissionais
const categories = [
  {
    id: 1,
    name: "Limpeza",
    icon: "/icons/cleaning.svg",
    count: 1234,
    examples: "Diaristas, Limpeza pós-obra, Limpeza comercial"
  },
  {
    id: 2,
    name: "Construção",
    icon: "/icons/construction.svg",
    count: 987,
    examples: "Pedreiros, Pintores, Eletricistas"
  },
  {
    id: 3,
    name: "Beleza",
    icon: "/icons/beauty.svg",
    count: 2345,
    examples: "Cabeleireiros, Manicures, Maquiadores"
  },
  {
    id: 4,
    name: "Tecnologia",
    icon: "/icons/tech.svg",
    count: 567,
    examples: "Técnicos de TI, Desenvolvedores, Design"
  },
  {
    id: 5,
    name: "Saúde",
    icon: "/icons/health.svg",
    count: 890,
    examples: "Enfermeiros, Fisioterapeutas, Cuidadores"
  }
];



export default function Home() {
  const { data: professionalsData, isLoading } = useProfessionals({ limit: 3 });
  const professionals = professionalsData?.data || [];

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categorias de Profissionais */}
      <Categories />

      {/* Seção de Promoções */}
      <PromotionsSection />

      {/* Profissionais em Destaque */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Profissionais em Destaque</h2>
            <Link
              href="/profissionais"
              className="text-primary font-medium hover:underline flex items-center gap-2"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((professional) => (
                <Link key={professional.id} href={`/profissionais/${professional.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={professional.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60'}
                        alt={professional.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-gray-500">{professional.specialties?.[0] || 'Profissional'}</p>
                          <p className="text-xs text-gray-400">{professional.company?.name || 'Autônomo'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-medium">{professional.stats.averageRating || 0}</span>
                          <span className="text-sm text-gray-500">({professional.stats.totalReviews || 0})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Disponível</span>
                        </div>
                        <p className="text-primary font-medium">Sob consulta</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60"
                  alt="Profissionais Verificados"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Seja uma Empresa Parceira</h3>
                  <p className="mb-4">Todos os profissionais passam por verificação de antecedentes</p>
                  <Link href="/empresas">
                    <Button variant="secondary">Saiba mais</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60"
                  alt="Seja um Profissional"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Seja um Profissional Parceiro</h3>
                  <p className="mb-4">Cadastre-se e comece a atender novos clientes</p>
                  <Button variant="secondary">Cadastrar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

