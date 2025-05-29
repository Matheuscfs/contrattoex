'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle, Clock, MapPin, Award, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';

interface FeaturedProfessional {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  highlight_text: string;
  badge_color: string;
  display_order: number;
  profile: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    specialties: string[];
    city: string | null;
    state: string | null;
    verified: boolean;
  };
  stats: {
    total_reviews: number;
    average_rating: number;
  };
}

export function FeaturedProfessionals() {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<FeaturedProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    loadFeaturedProfessionals();
  }, []);

  const loadFeaturedProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_professionals')
        .select(`
          *,
          profile:profiles(
            id,
            name,
            email,
            avatar_url,
            bio,
            specialties,
            city,
            state,
            verified
          )
        `)
        .eq('active', true)
        .order('display_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      setFeaturedProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'danger': return 'destructive';
      default: return 'default';
    }
  };

  const getBadgeIcon = (highlightText: string) => {
    if (highlightText.toLowerCase().includes('destaque')) return <Award className="w-3 h-3" />;
    if (highlightText.toLowerCase().includes('premium')) return <Zap className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= featuredProfessionals.length ? 0 : prev + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, featuredProfessionals.length - 3) : prev - 3
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Profissionais em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Conheça nossos profissionais mais bem avaliados
            </p>
          </div>
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
        </div>
      </section>
    );
  }

  if (featuredProfessionals.length === 0) {
    return null;
  }

  const visibleProfessionals = featuredProfessionals.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Profissionais em Destaque
          </h2>
          <p className="text-xl text-gray-600">
            Conheça nossos profissionais mais bem avaliados e verificados
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {featuredProfessionals.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                disabled={currentIndex + 3 >= featuredProfessionals.length}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Professional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProfessionals.map((featured) => (
              <Link key={featured.id} href={`/profissionais/${featured.profile.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group">
                  <CardContent className="p-0">
                    {/* Header com badge de destaque */}
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-4">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Award className="w-3 h-3 mr-1" />
                          {featured.highlight_text}
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg group-hover:scale-105 transition-transform">
                            <Image
                              src={featured.profile.avatar_url || getAvatarUrl(featured.profile.name)}
                              alt={featured.profile.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          {featured.profile.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                            {featured.profile.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {featured.profile.specialties[0] || 'Profissional'}
                          </p>
                          {featured.profile.city && featured.profile.state && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{featured.profile.city}, {featured.profile.state}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Título personalizado */}
                    <div className="px-6 py-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {featured.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {featured.description}
                      </p>
                    </div>
                    
                    {/* Especialidades */}
                    <div className="px-6 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {featured.profile.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {featured.profile.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{featured.profile.specialties.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">Profissional Verificado</span>
                        </div>
                        <Button size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Indicators */}
          {featuredProfessionals.length > 3 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: Math.ceil(featuredProfessionals.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentIndex / 3) === index
                      ? 'bg-primary'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/profissionais">
            <Button size="lg" className="px-8">
              Ver Todos os Profissionais
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 