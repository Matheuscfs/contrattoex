import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Buscar dados completos do profissional
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profissional não encontrado' },
          { status: 404 }
        );
      }
      
      console.error('Erro ao buscar profissional:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Dados simplificados para teste
    const totalReviews = 0;
    const averageRating = 0;
    
    // Distribuição por rating
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    
    // Horários de trabalho vazios
    const workingHours = {};
    
    // Localização vazia
    const location = null;
    
    // Formatar dados do profissional
    const formattedProfessional = {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      avatar: null,
      cpf: professional.cpf,
      specialties: professional.specialties || [],
      commissionRate: professional.commission_rate,
      status: professional.status,
      company: null,
      location,
      workingHours,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      },
      reviews: [],
      createdAt: professional.created_at
    };
    
    return NextResponse.json({ data: formattedProfessional });
    
  } catch (error) {
    console.error('Erro na API de detalhes do profissional:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 