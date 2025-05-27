import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating') || '';
    
    const offset = (page - 1) * limit;
    
    // Verificar se a empresa existe
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', id)
      .single();
    
    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }
    
    // Buscar avaliações da empresa
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('company_id', id)
      .eq('status', 'approved');
    
    // Aplicar filtro de rating se fornecido
    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }
    
    const { data: reviews, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Formatar avaliações
    const formattedReviews = reviews?.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      createdAt: review.created_at,
      user: {
        name: 'Usuário Anônimo',
        avatar: null
      },
      service: {
        name: 'Serviço não especificado'
      },
      response: review.response_comment ? {
        comment: review.response_comment,
        date: review.response_date
      } : null
    })) || [];
    
    // Calcular estatísticas das avaliações
    const allReviews = await supabase
      .from('reviews')
      .select('rating')
      .eq('company_id', id)
      .eq('status', 'approved');
    
    const totalReviews = allReviews.data?.length || 0;
    const averageRating = totalReviews > 0 
      ? allReviews.data!.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    
    // Distribuição por rating
    const ratingDistribution = {
      5: allReviews.data?.filter(r => r.rating === 5).length || 0,
      4: allReviews.data?.filter(r => r.rating === 4).length || 0,
      3: allReviews.data?.filter(r => r.rating === 3).length || 0,
      2: allReviews.data?.filter(r => r.rating === 2).length || 0,
      1: allReviews.data?.filter(r => r.rating === 1).length || 0,
    };
    
    // Calcular informações de paginação
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      data: formattedReviews,
      company: {
        id: company.id,
        name: company.name
      },
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      },
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
    console.error('Erro na API de avaliações da empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 