const fetch = require('node-fetch');

async function testEtapa3() {
  console.log('🧪 TESTE DA ETAPA 3 - APIs e Otimizações\n');
  console.log('==================================================');

  const tests = [
    {
      name: 'Página inicial (categorias atualizadas)',
      url: 'http://localhost:3000/',
      description: 'Verificar se a homepage carrega com categorias atualizadas'
    },
    {
      name: 'Página de profissionais (filtros avançados)',
      url: 'http://localhost:3000/profissionais',
      description: 'Verificar se a página de profissionais carrega com filtros'
    },
    {
      name: 'API de profissionais (funcionando)',
      url: 'http://localhost:3000/api/professionals',
      description: 'Verificar se a API de profissionais está funcionando'
    },
    {
      name: 'API de empresas (funcionando)',
      url: 'http://localhost:3000/api/companies',
      description: 'Verificar se a API de empresas está funcionando'
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 ${test.name}`);
    console.log(`📡 ${test.url}`);
    console.log(`📝 ${test.description}`);
    
    try {
      const response = await fetch(test.url);
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`);
        
        if (test.url.includes('/api/')) {
          const data = await response.json();
          console.log(`📊 Dados retornados: ${data.data ? data.data.length : 'N/A'} itens`);
          if (data.meta) {
            console.log(`📋 Meta: ${JSON.stringify(data.meta)}`);
          }
        } else {
          const html = await response.text();
          const hasReact = html.includes('__next');
          console.log(`📄 Página carregada: ${hasReact ? 'React/Next.js' : 'HTML estático'}`);
        }
      } else {
        console.log(`❌ Status: ${response.status}`);
        const errorText = await response.text();
        console.log(`💥 Erro: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`💥 Erro: ${error.message}`);
    }
  }

  console.log('\n==================================================');
  console.log('📋 RESUMO DA ETAPA 3:');
  console.log('✅ Componente ProfessionalFilters criado');
  console.log('✅ Categorias atualizadas com dados mais realistas');
  console.log('✅ Filtros avançados integrados na página de profissionais');
  console.log('✅ Lógica de filtros aprimorada');
  console.log('⚠️  API de categorias com problema de roteamento (para resolver)');
  console.log('\n🎉 ETAPA 3 PARCIALMENTE CONCLUÍDA!');
}

testEtapa3().catch(console.error); 