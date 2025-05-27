import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Buscar dados completos da empresa
    const { data: company, error } = await supabase
      .from('companies')
      .select(`
        *,
        company_addresses(*),
        company_contacts(*),
        company_business_hours(*),
        company_services(*),
        reviews(
          id,
          rating,
          comment,
          created_at,
          user_id
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        );
      }
      
      console.error('Erro ao buscar empresa:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
    
    // Calcular estatísticas das avaliações
    const reviews = company.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
      : 0;
    
    // Formatar dados da empresa
    const formattedCompany = {
      ...company,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalServices: company.company_services?.length || 0
      },
      address: company.company_addresses?.[0] || null,
      contact: company.company_contacts?.[0] || null,
      businessHours: company.company_business_hours || [],
      services: company.company_services || [],
      reviews: reviews.slice(0, 10) // Limitar a 10 avaliações mais recentes
    };
    
    // Remover dados aninhados já formatados
    delete formattedCompany.company_addresses;
    delete formattedCompany.company_contacts;
    delete formattedCompany.company_business_hours;
    delete formattedCompany.company_services;
    
    return NextResponse.json({ data: formattedCompany });
    
  } catch (error) {
    console.error('Erro na API de detalhes da empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 