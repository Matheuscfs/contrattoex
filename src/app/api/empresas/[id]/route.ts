import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Se for o ID específico da TK Reguladora, retornar dados mockados
    if (id === '61e4ba9a-c074-4920-9428-9a0dd2580f36') {
      return NextResponse.json({
        data: {
          id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
          user_id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
          cnpj: '22.089.428/0001-95',
          razao_social: 'TK REGULADORA E LOCACAO DE VEICULOS LTDA',
          nome_fantasia: 'TK REGULADORA',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: '',
          description: 'Empresa especializada em locação de automóveis sem condutor, regulação de sinistros e serviços automotivos. Com mais de 10 anos de experiência no mercado, oferecemos soluções completas para o setor automotivo.',
          address_street: 'RUA MARINGA',
          address_number: '2182',
          address_complement: 'SALA01',
          address_neighborhood: 'SAO CRISTOVAO',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85816-595',
          contact_phone: '(45) 8822-4299',
          contact_email: 'supervisao@businessgestao.com.br',
          contact_whatsapp: '(45) 8822-4299',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2015-03-20T00:00:00Z',
          updated_at: new Date().toISOString(),
          status: 'active',
          verified: true
        }
      });
    }
    
    // Buscar dados reais do Supabase
    const { data: company, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', id)
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
    
    return NextResponse.json({ data: company });
    
  } catch (error) {
    console.error('Erro na API de empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 