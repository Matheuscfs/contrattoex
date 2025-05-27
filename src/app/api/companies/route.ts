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
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const status = searchParams.get('status') || 'active';
    
    const offset = (page - 1) * limit;
    
    // Query base - apenas empresas ativas por padrão
    let query = supabase
      .from('companies')
      .select(`
        *,
        company_addresses(*),
        company_contacts(*),
        company_business_hours(*),
        company_services(*)
      `)
      .eq('status', status === 'all' ? 'active' : status);
    
    // Aplicar filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (category) {
      query = query.contains('categories', [category]);
    }
    
    if (location) {
      query = query.or(`
        company_addresses.city.ilike.%${location}%,
        company_addresses.state.ilike.%${location}%
      `);
    }
    
    // Ordenação e paginação
    const { data: companies, error, count } = await query
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erro ao buscar empresas:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Calcular informações de paginação
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      data: companies || [],
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
    console.error('Erro na API de empresas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 