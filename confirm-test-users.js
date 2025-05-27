const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com service_role key para operações administrativas
const supabaseUrl = 'https://ylngkqqhhgerpnmngloi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbmdrcXFoaGdlcnBubW5nbG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA0Njg3NywiZXhwIjoyMDYzNjIyODc3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // Service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function confirmTestUsers() {
  console.log('📧 Confirmando emails dos usuários de teste...\n');

  const testEmails = [
    'cliente@teste.com',
    'profissional@teste.com', 
    'empresa@teste.com'
  ];

  for (const email of testEmails) {
    try {
      console.log(`✉️  Confirmando email: ${email}`);
      
      // Buscar o usuário na tabela auth.users
      const { data: users, error: userError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', email);

      if (userError) {
        console.error(`   ❌ Erro ao buscar usuário:`, userError);
        continue;
      }

      if (!users || users.length === 0) {
        console.log(`   ⚠️  Usuário não encontrado: ${email}`);
        continue;
      }

      const user = users[0];
      console.log(`   📋 Usuário encontrado: ${user.id}`);

      // Confirmar email usando admin API
      const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          email_confirm: true,
          email_confirmed_at: new Date().toISOString()
        }
      );

      if (error) {
        console.error(`   ❌ Erro ao confirmar email:`, error);
        continue;
      }

      console.log(`   ✅ Email confirmado com sucesso!`);
      
    } catch (error) {
      console.error(`   ❌ Erro inesperado para ${email}:`, error);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('✅ Processo de confirmação concluído!');
  console.log('\n🔐 Agora você pode testar o login com:');
  console.log('   CLIENTE: cliente@teste.com / 123456');
  console.log('   PROFISSIONAL: profissional@teste.com / 123456');
  console.log('   EMPRESA: empresa@teste.com / 123456');
}

// Executar confirmação
confirmTestUsers().catch(console.error); 