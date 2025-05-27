import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de busca e filtros
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const specialty = searchParams.get('specialty') || '';
    const location = searchParams.get('location') || '';
    const status = searchParams.get('status') || 'active';
    
    const offset = (page - 1) * limit;
    
    // Query base - buscar profissionais com dados do perfil
    let query = supabase
      .from('professionals')
      .select('*')
      .eq('status', status);
    
    // Aplicar filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%,profiles.name.ilike.%${search}%`);
    }
    
    if (specialty) {
      query = query.contains('specialties', [specialty]);
    }
    
    // Ordenação e paginação
    const { data: professionals, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erro ao buscar profissionais:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Formatar dados dos profissionais
    const formattedProfessionals = professionals?.map(professional => {
      return {
        id: professional.id,
        name: professional.name,
        avatar: null,
        specialties: professional.specialties || [],
        company: null,
        stats: {
          totalReviews: 0,
          averageRating: 0
        },
        location: 'Localização não informada',
        commissionRate: professional.commission_rate,
        createdAt: professional.created_at
      };
    }) || [];
    
    // Calcular informações de paginação
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      data: formattedProfessionals,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Erro na API de profissionais:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 