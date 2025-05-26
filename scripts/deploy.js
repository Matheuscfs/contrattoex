#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy para contrattoex.com...');

// Verificar se o build está funcionando
try {
  console.log('📦 Executando build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

// Verificar arquivos essenciais
const essentialFiles = [
  'netlify.toml',
  'next.config.js',
  '.next'
];

console.log('🔍 Verificando arquivos essenciais...');
for (const file of essentialFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.error(`❌ Arquivo essencial não encontrado: ${file}`);
    process.exit(1);
  }
}

console.log('✅ Todos os arquivos essenciais estão presentes!');

// Instruções para o usuário
console.log(`
🌐 PRÓXIMOS PASSOS PARA CONFIGURAR O DOMÍNIO:

1. 📋 NETLIFY DASHBOARD:
   - Acesse: https://app.netlify.com
   - Vá para seu site > Domain settings
   - Clique em "Add custom domain"
   - Digite: contrattoex.com
   - Confirme a configuração

2. 🔧 CONFIGURAÇÃO DNS (no seu provedor de domínio):
   Configure os seguintes registros DNS:

   TIPO    NOME    VALOR
   ────────────────────────────────────────
   A       @       75.2.60.5
   CNAME   www     seu-site.netlify.app
   
   OU (se suportar ALIAS/ANAME):
   ALIAS   @       seu-site.netlify.app

3. 🔒 SSL AUTOMÁTICO:
   - O Netlify configurará SSL automaticamente
   - Aguarde 24-48h para propagação completa

4. ✅ VERIFICAÇÃO:
   - Teste: https://contrattoex.com
   - Teste: https://www.contrattoex.com

📞 SUPORTE:
Se precisar de ajuda, verifique:
- Status DNS: https://dnschecker.org
- Logs Netlify: Dashboard > Functions > Logs
`);

console.log('🎉 Deploy preparado! Siga as instruções acima.'); 