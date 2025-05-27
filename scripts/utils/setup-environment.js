#!/usr/bin/env node

/**
 * Script de Configuração do Ambiente
 * 
 * Este script configura automaticamente o ambiente de desenvolvimento,
 * criando arquivos necessários e verificando configurações.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando ambiente de desenvolvimento...\n');

// Template do .env.local
const envTemplate = `# Configurações do Pusher para notificações em tempo real
# Para produção, obtenha credenciais reais em https://pusher.com/
NEXT_PUBLIC_PUSHER_KEY=fffe5c1d86e941f2a9f1
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
PUSHER_APP_ID=1997737
PUSHER_SECRET=your_pusher_secret_here

# Configurações do Supabase (já configuradas no next.config.js como fallback)
NEXT_PUBLIC_SUPABASE_URL=https://ylngkqqhhgerpnmngloi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbmdrcXFoaGdlcnBubW5nbG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNDY4NzcsImV4cCI6MjA2MzYyMjg3N30.MpiCigNYqg7ofupd3nOxCDZNSpnKMo210o4LUGxGGko

# Configurações de desenvolvimento
NODE_ENV=development
`;

let changes = [];

// 1. Verificar e criar .env.local
console.log('📄 Verificando arquivo .env.local...');
if (!fs.existsSync('.env.local')) {
  try {
    fs.writeFileSync('.env.local', envTemplate);
    console.log('   ✅ Arquivo .env.local criado com configurações padrão');
    changes.push('Criado .env.local');
  } catch (error) {
    console.log('   ⚠️  Não foi possível criar .env.local automaticamente');
    console.log('   💡 Crie manualmente com o conteúdo do guia de configuração');
  }
} else {
  console.log('   ✅ Arquivo .env.local já existe');
}

// 2. Verificar ícone maintenance.svg
console.log('\n🎨 Verificando ícone maintenance.svg...');
if (fs.existsSync('public/icons/maintenance.svg')) {
  console.log('   ✅ Ícone maintenance.svg encontrado');
} else {
  console.log('   ❌ Ícone maintenance.svg ausente');
  console.log('   💡 Execute: npm run verify-organization para mais detalhes');
}

// 3. Verificar estrutura de diretórios
console.log('\n📁 Verificando estrutura de diretórios...');
const requiredDirs = [
  'database/migrations',
  'scripts/test',
  'docs/guides',
  'config'
];

let allDirsExist = true;
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ ausente`);
    allDirsExist = false;
  }
}

// 4. Verificar package.json scripts
console.log('\n📦 Verificando scripts do package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'verify-organization',
  'test:auth',
  'test:companies'
];

for (const script of requiredScripts) {
  if (packageJson.scripts[script]) {
    console.log(`   ✅ Script "${script}" configurado`);
  } else {
    console.log(`   ❌ Script "${script}" ausente`);
  }
}

// Relatório final
console.log('\n' + '='.repeat(60));
console.log('📊 RELATÓRIO DE CONFIGURAÇÃO');
console.log('='.repeat(60));

if (changes.length > 0) {
  console.log('\n✅ ALTERAÇÕES REALIZADAS:');
  changes.forEach(change => console.log(`   - ${change}`));
}

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('   1. Reinicie o servidor: npm run dev');
console.log('   2. Verifique a organização: npm run verify-organization');
console.log('   3. Teste a autenticação: npm run test:auth');

if (!allDirsExist) {
  console.log('\n⚠️  ATENÇÃO:');
  console.log('   Alguns diretórios estão ausentes.');
  console.log('   Execute: npm run verify-organization para mais detalhes');
}

console.log('\n📚 DOCUMENTAÇÃO:');
console.log('   - Guia de configuração: docs/guides/CONFIGURACAO_AMBIENTE.md');
console.log('   - Configuração do Pusher: docs/pusher-setup.md');
console.log('   - Organização de arquivos: docs/guides/ORGANIZACAO_ARQUIVOS.md');

console.log('\n🎉 Configuração concluída!'); 