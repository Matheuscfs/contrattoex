const fetch = require('node-fetch');

async function testCategoriesAPI() {
  console.log('🧪 TESTE DA API DE CATEGORIAS\n');
  console.log('==================================================');

  const tests = [
    {
      name: 'Todas as categorias',
      url: 'http://localhost:3001/api/categories'
    },
    {
      name: 'Categorias de profissionais',
      url: 'http://localhost:3001/api/categories?type=professionals'
    },
    {
      name: 'Categorias de empresas',
      url: 'http://localhost:3001/api/categories?type=companies'
    },
    {
      name: 'Categorias com contadores',
      url: 'http://localhost:3001/api/categories?includeCount=true'
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 ${test.name}`);
    console.log(`📡 ${test.url}`);
    
    try {
      const response = await fetch(test.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Total de categorias: ${data.meta.total}`);
        console.log(`📋 Primeiras categorias:`);
        
        data.data.slice(0, 2).forEach(category => {
          console.log(`   - ${category.name} (${category.type})`);
          console.log(`     Subcategorias: ${category.subcategories.length}`);
        });
      } else {
        console.log(`❌ Status: ${response.status}`);
        const errorText = await response.text();
        console.log(`💥 Erro: ${errorText}`);
      }
    } catch (error) {
      console.log(`💥 Erro: ${error.message}`);
    }
  }

  console.log('\n==================================================');
  console.log('🎉 TESTE CONCLUÍDO!');
}

testCategoriesAPI().catch(console.error); 