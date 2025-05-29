const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🧪 Testando conexão com Supabase...\n');

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Verificando variáveis de ambiente:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Definido' : '❌ Não definido'}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Definido' : '❌ Não definido'}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variáveis de ambiente não configuradas. Configure:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
    process.exit(1);
  }

  try {
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('🔗 Testando conexão...');
    
    // Testar conexão básica
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erro na conexão:', testError.message);
      return false;
    }

    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Buscar empresas
    console.log('📊 Buscando empresas...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        status,
        rating,
        total_reviews,
        categories,
        business_type
      `)
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(10);

    if (companiesError) {
      console.error('❌ Erro ao buscar empresas:', companiesError.message);
      return false;
    }

    console.log(`✅ Empresas encontradas: ${companies?.length || 0}`);
    
    if (companies && companies.length > 0) {
      console.log('\n📋 Primeiras empresas:');
      companies.slice(0, 3).forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (Rating: ${company.rating})`);
      });
    }

    // Testar relacionamentos
    console.log('\n🔗 Testando relacionamentos...');
    const { data: companiesWithRelations, error: relationsError } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        company_addresses (city, state),
        company_contacts (phone, email),
        company_services (name, price)
      `)
      .eq('status', 'active')
      .limit(1);

    if (relationsError) {
      console.error('❌ Erro ao buscar relacionamentos:', relationsError.message);
      return false;
    }

    console.log('✅ Relacionamentos funcionando!');
    
    if (companiesWithRelations && companiesWithRelations.length > 0) {
      const company = companiesWithRelations[0];
      console.log(`   Empresa: ${company.name}`);
      console.log(`   Endereços: ${company.company_addresses?.length || 0}`);
      console.log(`   Contatos: ${company.company_contacts?.length || 0}`);
      console.log(`   Serviços: ${company.company_services?.length || 0}`);
    }

    console.log('\n🎉 Todos os testes passaram! O Supabase está funcionando corretamente.');
    return true;

  } catch (error) {
    console.error('💥 Erro fatal:', error.message);
    return false;
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testSupabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Erro não tratado:', error);
      process.exit(1);
    });
}

module.exports = { testSupabaseConnection }; 