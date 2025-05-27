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
    const category = searchParams.get('category') || '';
    
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
    
    // Buscar serviços da empresa
    let query = supabase
      .from('company_services')
      .select(`
        *,
        reviews(
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('company_id', id);
    
    // Aplicar filtro de categoria se fornecido
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data: services, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erro ao buscar serviços:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Calcular estatísticas para cada serviço
    const formattedServices = services?.map(service => {
      const reviews = service.reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
        : 0;
      
      return {
        ...service,
        stats: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10
        },
        reviews: reviews.slice(0, 5) // Limitar a 5 avaliações por serviço
      };
    }) || [];
    
    // Calcular informações de paginação
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      data: formattedServices,
      company: {
        id: company.id,
        name: company.name
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
    console.error('Erro na API de serviços da empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 