import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CompanyRegistrationData {
  // Dados da empresa
  name: string;
  cnpj: string;
  business_type: string;
  plan_type: 'basic' | 'pro' | 'enterprise';
  email: string;
  password: string;
  description?: string;
  
  // Endereço
  postal_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Contato
  phone: string;
  whatsapp?: string;
  website?: string;
  
  // Horário de funcionamento
  business_hours: {
    day: string;
    open: string;
    close: string;
    is_closed: boolean;
  }[];
  
  // Categorias de serviços
  categories?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const data: CompanyRegistrationData = await request.json();
    
    // Validações básicas
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    if (data.password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }
    
    // Verificar se CNPJ já existe (se fornecido)
    if (data.cnpj) {
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('cnpj', data.cnpj)
        .single();
        
      if (existingCompany) {
        return NextResponse.json(
          { error: 'CNPJ já cadastrado' },
          { status: 400 }
        );
      }
    }
    
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: 'company',
          name: data.name
        }
      }
    });
    
    if (authError) {
      console.error('Erro ao criar usuário:', authError);
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      );
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      );
    }
    
    // Criar empresa
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: authData.user.id,
        name: data.name,
        description: data.description || '',
        cnpj: data.cnpj,
        business_type: data.business_type,
        plan_type: data.plan_type,
        email: data.email,
        categories: data.categories || [],
        status: 'pending',
        verified: false
      })
      .select()
      .single();
    
    if (companyError) {
      console.error('Erro ao criar empresa:', companyError);
      
      // Se houve erro ao criar empresa, tentar deletar o usuário criado
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: 'Erro ao criar empresa' },
        { status: 500 }
      );
    }
    
    // Criar endereço
    const { error: addressError } = await supabase
      .from('company_addresses')
      .insert({
        company_id: company.id,
        postal_code: data.postal_code,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state
      });
    
    if (addressError) {
      console.error('Erro ao criar endereço:', addressError);
      return NextResponse.json(
        { error: 'Erro ao criar endereço da empresa' },
        { status: 500 }
      );
    }
    
    // Criar contatos
    const { error: contactError } = await supabase
      .from('company_contacts')
      .insert({
        company_id: company.id,
        phone: data.phone,
        email: data.email,
        whatsapp: data.whatsapp,
        website: data.website
      });
    
    if (contactError) {
      console.error('Erro ao criar contatos:', contactError);
      return NextResponse.json(
        { error: 'Erro ao criar contatos da empresa' },
        { status: 500 }
      );
    }
    
    // Criar horários de funcionamento
    if (data.business_hours && data.business_hours.length > 0) {
      const { error: hoursError } = await supabase
        .from('company_business_hours')
        .insert(
          data.business_hours.map(hour => ({
            company_id: company.id,
            day: hour.day,
            open: hour.is_closed ? null : hour.open,
            close: hour.is_closed ? null : hour.close,
            is_closed: hour.is_closed
          }))
        );
      
      if (hoursError) {
        console.error('Erro ao criar horários:', hoursError);
        return NextResponse.json(
          { error: 'Erro ao criar horários de funcionamento' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Empresa cadastrada com sucesso! Verifique seu e-mail para confirmar sua conta.',
      data: {
        company_id: company.id,
        user_id: authData.user.id,
        email: data.email,
        status: 'pending'
      }
    });
    
  } catch (error) {
    console.error('Erro no cadastro de empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 