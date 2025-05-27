import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const includeCount = searchParams.get('includeCount') === 'true';
    
    // Categorias de profissionais
    const professionalCategories = [
      {
        id: 'servicos-gerais',
        name: 'Serviços Gerais & Manutenção',
        type: 'professional',
        icon: '/icons/maintenance.svg',
        description: 'Serviços de manutenção e reparos em geral',
        count: includeCount ? 45 : undefined,
        subcategories: [
          { id: 'eletricistas', name: 'Eletricistas', count: includeCount ? 12 : undefined },
          { id: 'encanadores', name: 'Encanadores', count: includeCount ? 8 : undefined },
          { id: 'diaristas', name: 'Diaristas & Faxineiras', count: includeCount ? 15 : undefined },
          { id: 'pintores', name: 'Pintores', count: includeCount ? 10 : undefined }
        ]
      },
      {
        id: 'beleza',
        name: 'Beleza & Bem-estar',
        type: 'professional',
        icon: '/icons/beauty.svg',
        description: 'Profissionais de beleza e bem-estar',
        count: includeCount ? 32 : undefined,
        subcategories: [
          { id: 'cabeleireiros', name: 'Cabeleireiros & Barbeiros', count: includeCount ? 18 : undefined },
          { id: 'esteticistas', name: 'Esteticistas', count: includeCount ? 14 : undefined }
        ]
      },
      {
        id: 'saude',
        name: 'Saúde & Terapias',
        type: 'professional',
        icon: '/icons/health.svg',
        description: 'Profissionais da área da saúde',
        count: includeCount ? 28 : undefined,
        subcategories: [
          { id: 'fisioterapeutas', name: 'Fisioterapeutas', count: includeCount ? 12 : undefined },
          { id: 'personal-trainers', name: 'Personal Trainers', count: includeCount ? 16 : undefined }
        ]
      }
    ];

    // Categorias de empresas
    const companyCategories = [
      {
        id: 'construcao',
        name: 'Construção & Reforma',
        type: 'company',
        icon: '/icons/construction.svg',
        description: 'Empresas de construção e reforma',
        count: includeCount ? 25 : undefined,
        subcategories: [
          { id: 'construtoras', name: 'Construtoras', count: includeCount ? 8 : undefined },
          { id: 'reformas', name: 'Empresas de Reforma', count: includeCount ? 17 : undefined }
        ]
      },
      {
        id: 'limpeza',
        name: 'Limpeza & Conservação',
        type: 'company',
        icon: '/icons/cleaning.svg',
        description: 'Empresas de limpeza e conservação',
        count: includeCount ? 18 : undefined,
        subcategories: [
          { id: 'limpeza-residencial', name: 'Limpeza Residencial', count: includeCount ? 12 : undefined },
          { id: 'limpeza-comercial', name: 'Limpeza Comercial', count: includeCount ? 6 : undefined }
        ]
      }
    ];

    let categories = [];
    
    if (type === 'professionals' || type === 'all') {
      categories = [...categories, ...professionalCategories];
    }
    
    if (type === 'companies' || type === 'all') {
      categories = [...categories, ...companyCategories];
    }

    return NextResponse.json({
      data: categories,
      meta: {
        total: categories.length,
        type,
        includeCount
      }
    });

  } catch (error) {
    console.error('Erro na API de categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 