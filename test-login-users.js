const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://ylngkqqhhgerpnmngloi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbmdrcXFoaGdlcnBubW5nbG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDY4NzcsImV4cCI6MjA2MzYyMjg3N30.MpiCigNYqg7ofupd3nOxCDZNSpnKMo210o4LUGxGGko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔍 Testando sistema de login...\n');

  // Usuários de teste para cada tipo
  const testUsers = [
    {
      email: 'cliente@teste.com',
      password: '123456',
      name: 'Cliente Teste',
      role: 'customer'
    },
    {
      email: 'profissional@teste.com',
      password: '123456',
      name: 'Profissional Teste',
      role: 'professional'
    },
    {
      email: 'empresa@teste.com',
      password: '123456',
      name: 'Empresa Teste',
      role: 'business'
    }
  ];

  // 1. Verificar usuários existentes
  console.log('📋 Verificando usuários existentes...');
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('❌ Erro ao buscar profiles:', error);
    } else {
      console.log(`✅ Encontrados ${profiles.length} usuários no sistema:`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.role}) - Status: ${profile.status || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 2. Criar usuários de teste se não existirem
  console.log('👥 Criando usuários de teste...');
  
  for (const user of testUsers) {
    try {
      console.log(`\n📝 Criando usuário: ${user.email} (${user.role})`);
      
      // Verificar se já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (existingProfile) {
        console.log(`   ⚠️  Usuário já existe: ${user.email}`);
        continue;
      }

      // Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role,
          },
        },
      });

      if (authError) {
        console.error(`   ❌ Erro ao criar usuário ${user.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        console.log(`   ✅ Usuário criado: ${user.email} (ID: ${authData.user.id})`);
        
        // Aguardar um pouco para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se o perfil foi criado
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.log(`   ⚠️  Perfil não encontrado automaticamente, criando manualmente...`);
          
          // Criar perfil manualmente
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              status: user.role === 'customer' ? 'approved' : 'pending'
            });

          if (insertError) {
            console.error(`   ❌ Erro ao criar perfil manualmente:`, insertError);
          } else {
            console.log(`   ✅ Perfil criado manualmente`);
          }
        } else {
          console.log(`   ✅ Perfil criado automaticamente: ${newProfile.role}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Erro inesperado ao criar ${user.email}:`, error);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 3. Testar login para cada usuário
  console.log('🔐 Testando login para cada usuário...');
  
  for (const user of testUsers) {
    try {
      console.log(`\n🔑 Testando login: ${user.email}`);
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (loginError) {
        console.error(`   ❌ Erro no login:`, loginError.message);
        continue;
      }

      if (loginData.user) {
        console.log(`   ✅ Login bem-sucedido: ${loginData.user.email}`);
        
        // Buscar perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginData.user.id)
          .single();

        if (profileError) {
          console.error(`   ❌ Erro ao buscar perfil:`, profileError);
        } else {
          console.log(`   📋 Perfil encontrado:`);
          console.log(`      - Nome: ${profile.name}`);
          console.log(`      - Role: ${profile.role}`);
          console.log(`      - Status: ${profile.status || 'N/A'}`);
          console.log(`      - Verificado: ${profile.verified || false}`);
        }

        // Fazer logout
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error(`   ❌ Erro inesperado no login ${user.email}:`, error);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('✅ Teste de login concluído!');
  console.log('\n📝 Credenciais de teste criadas:');
  testUsers.forEach(user => {
    console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
  });
}

// Executar teste
testLogin().catch(console.error); 