const baseUrl = 'http://localhost:3001'; // Porta que o Next.js está usando

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testando: ${description}`);
    console.log(`📡 Endpoint: ${endpoint}`);
    
    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Sucesso (${response.status})`);
      console.log(`📊 Dados retornados:`, JSON.stringify(data, null, 2).substring(0, 500) + '...');
    } else {
      console.log(`❌ Erro (${response.status}):`, data);
    }
  } catch (error) {
    console.log(`💥 Erro de conexão:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes das APIs...\n');
  
  // Teste das APIs de empresas
  await testAPI('/api/companies?limit=2', 'Listagem de empresas');
  
  // Buscar ID de uma empresa para testes específicos
  try {
    const companiesResponse = await fetch(`${baseUrl}/api/companies?limit=1`);
    const companiesData = await companiesResponse.json();
    
    if (companiesData.data && companiesData.data.length > 0) {
      const companyId = companiesData.data[0].id;
      
      await testAPI(`/api/companies/${companyId}`, 'Detalhes de empresa específica');
      await testAPI(`/api/companies/${companyId}/services`, 'Serviços de empresa');
      await testAPI(`/api/companies/${companyId}/reviews`, 'Avaliações de empresa');
    }
  } catch (error) {
    console.log('❌ Erro ao buscar ID da empresa para testes específicos');
  }
  
  // Teste das APIs de profissionais
  await testAPI('/api/professionals?limit=2', 'Listagem de profissionais');
  
  // Buscar ID de um profissional para testes específicos
  try {
    const professionalsResponse = await fetch(`${baseUrl}/api/professionals?limit=1`);
    const professionalsData = await professionalsResponse.json();
    
    if (professionalsData.data && professionalsData.data.length > 0) {
      const professionalId = professionalsData.data[0].id;
      
      await testAPI(`/api/professionals/${professionalId}`, 'Detalhes de profissional específico');
      await testAPI(`/api/professionals/${professionalId}/reviews`, 'Avaliações de profissional');
    }
  } catch (error) {
    console.log('❌ Erro ao buscar ID do profissional para testes específicos');
  }
  
  console.log('\n🏁 Testes concluídos!');
}

// Aguardar um pouco para o servidor inicializar
setTimeout(runTests, 3000); 