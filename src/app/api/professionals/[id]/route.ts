import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Buscar dados do profissional na tabela profiles
    const { data: professional, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        phone,
        avatar_url,
        bio,
        specialties,
        city,
        state,
        verified,
        status,
        featured,
        created_at
      `)
      .eq('id', id)
      .eq('role', 'professional')
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
    
    // Buscar estatísticas de avaliações
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('professional_id', professional.id);
    
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0 && reviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    // Formatar dados do profissional
    const formattedProfessional = {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      avatar: professional.avatar_url,
      bio: professional.bio,
      specialties: professional.specialties || [],
      status: professional.status,
      verified: professional.verified,
      featured: professional.featured,
      location: {
        city: professional.city || 'Não informado',
        state: professional.state || '',
        fullAddress: `${professional.city || 'Não informado'}, ${professional.state || ''}`
      },
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      createdAt: professional.created_at
    };
    
    return NextResponse.json({ data: formattedProfessional });
    
  } catch (error) {
    console.error('Erro na API de profissional:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 