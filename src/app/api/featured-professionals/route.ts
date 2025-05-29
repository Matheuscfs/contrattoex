import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '6');
    const includeStats = searchParams.get('include_stats') === 'true';
    
    // Buscar profissionais em destaque
    const { data: featuredProfessionals, error } = await supabase
      .from('featured_professionals')
      .select(`
        *,
        profile:profiles!featured_professionals_profile_id_fkey (
          id,
          name,
          email,
          avatar_url,
          bio,
          specialties,
          city,
          state,
          verified,
          phone
        )
      `)
      .eq('active', true)
      .or('ends_at.is.null,ends_at.gt.now()')
      .order('display_order', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar profissionais em destaque:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    // Se solicitado, incluir estatísticas
    let professionalsWithStats = featuredProfessionals;
    
    if (includeStats) {
      professionalsWithStats = await Promise.all(
        (featuredProfessionals || []).map(async (featured) => {
          // Por enquanto, gerar estatísticas simuladas
          // Em produção, você buscaria de uma tabela de reviews/avaliações
          const stats = {
            total_reviews: Math.floor(Math.random() * 50) + 10,
            average_rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
            total_services: Math.floor(Math.random() * 100) + 20,
            response_time: Math.floor(Math.random() * 4) + 1 // horas
          };

          return {
            ...featured,
            stats
          };
        })
      );
    }

    return NextResponse.json({
      data: professionalsWithStats,
      total: professionalsWithStats?.length || 0
    });

  } catch (error) {
    console.error('Erro na API de profissionais em destaque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    const {
      profile_id,
      title,
      description,
      highlight_text,
      badge_color = 'primary',
      display_order = 0,
      starts_at,
      ends_at
    } = body;

    // Verificar se o usuário é admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Criar destaque
    const { data, error } = await supabase
      .from('featured_professionals')
      .insert([{
        profile_id,
        title,
        description,
        highlight_text,
        badge_color,
        display_order,
        starts_at: starts_at || new Date().toISOString(),
        ends_at,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar destaque:', error);
      return NextResponse.json(
        { error: 'Erro ao criar destaque' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Erro na API de criação de destaque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 