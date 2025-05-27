const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://ylngkqqhhgerpnmngloi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbmdrcXFoaGdlcnBubW5nbG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDY4NzcsImV4cCI6MjA2MzYyMjg3N30.MpiCigNYqg7ofupd3nOxCDZNSpnKMo210o4LUGxGGko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLoginOnly() {
  console.log('🔐 Testando login dos usuários...\n');

  const testUsers = [
    {
      email: 'cliente@teste.com',
      password: '123456',
      expectedRole: 'customer'
    },
    {
      email: 'profissional@teste.com',
      password: '123456',
      expectedRole: 'professional'
    },
    {
      email: 'empresa@teste.com',
      password: '123456',
      expectedRole: 'business'
    }
  ];

  for (const user of testUsers) {
    try {
      console.log(`\n🔑 Testando login: ${user.email}`);
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (loginError) {
        console.error(`   ❌ Erro no login:`, loginError.message);
        
        if (loginError.message.includes('Email not confirmed')) {
          console.log(`   💡 Solução: Execute o script database/migrations/confirm-users.sql no Supabase SQL Editor`);
        }
        continue;
      }

      if (loginData.user) {
        console.log(`   ✅ Login bem-sucedido: ${loginData.user.email}`);
        console.log(`   📧 Email confirmado: ${loginData.user.email_confirmed_at ? 'Sim' : 'Não'}`);
        
        // Buscar perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginData.user.id)
          .single();

        if (profileError) {
          console.error(`   ❌ Erro ao buscar perfil:`, profileError.message);
        } else {
          console.log(`   📋 Perfil encontrado:`);
          console.log(`      - Nome: ${profile.name}`);
          console.log(`      - Role: ${profile.role} ${profile.role === user.expectedRole ? '✅' : '❌'}`);
          console.log(`      - Status: ${profile.status || 'N/A'}`);
          console.log(`      - Verificado: ${profile.verified || false}`);
          
          // Determinar redirecionamento
          const redirectPath = profile.role === 'business' ? '/empresa/perfil' : 
                              profile.role === 'professional' ? '/profissional/perfil' : 
                              '/cliente/perfil';
          console.log(`      - Redirecionamento: ${redirectPath}`);
        }

        // Fazer logout
        await supabase.auth.signOut();
        console.log(`   🚪 Logout realizado`);
      }
    } catch (error) {
      console.error(`   ❌ Erro inesperado no login ${user.email}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('📝 RESUMO DOS TESTES:');
  console.log('');
  console.log('🔐 Credenciais de teste:');
  testUsers.forEach(user => {
    console.log(`   ${user.expectedRole.toUpperCase()}: ${user.email} / ${user.password}`);
  });
  
  console.log('\n💡 Se houver erro "Email not confirmed":');
  console.log('   1. Acesse o Supabase Dashboard');
  console.log('   2. Vá em SQL Editor');
  console.log('   3. Execute o script database/migrations/confirm-users.sql');
  console.log('   4. Execute este teste novamente');
  
  console.log('\n🌐 URLs para testar no navegador:');
  console.log('   Login: http://localhost:3000/entrar');
  console.log('   Cadastro Cliente: http://localhost:3000/cadastro/cliente');
  console.log('   Cadastro Profissional/Empresa: http://localhost:3000/cadastro/profissional-empresa');
}

// Executar teste
testLoginOnly().catch(console.error); 