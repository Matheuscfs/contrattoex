#!/usr/bin/env node

/**
 * Script de Verificação da Organização de Arquivos
 * 
 * Este script verifica se a reorganização dos arquivos foi bem-sucedida
 * e se não há referências quebradas no código.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando organização de arquivos...\n');

// Estrutura esperada
const expectedStructure = {
  'database': ['migrations', 'scripts', 'seeds'],
  'docs': ['fixes', 'implementations', 'guides'],
  'scripts': ['test', 'deploy', 'utils'],
  'config': []
};

// Arquivos que devem existir
const expectedFiles = {
  'database/migrations': [
    'check-and-fix-tables.sql',
    'check-auth-schema.sql',
    'confirm-users.sql',
    'complete-setup.sql',
    'final-setup.sql'
  ],
  'scripts/test': [
    'test-login-simple.js',
    'test-cadastro-empresas.js',
    'test-categories.js'
  ],
  'docs/fixes': [
    'button_event_handler_fix.md',
    'client_pages_event_handler_fix.md',
    'dashboard_fix.md'
  ],
  'config': [
    'claude-vertex-ai-key.json',
    'netlify.toml'
  ]
};

let errors = [];
let warnings = [];

// Verificar estrutura de diretórios
console.log('📁 Verificando estrutura de diretórios...');
for (const [dir, subdirs] of Object.entries(expectedStructure)) {
  if (!fs.existsSync(dir)) {
    errors.push(`❌ Diretório ausente: ${dir}`);
    continue;
  }
  
  console.log(`   ✅ ${dir}/`);
  
  for (const subdir of subdirs) {
    const fullPath = path.join(dir, subdir);
    if (!fs.existsSync(fullPath)) {
      errors.push(`❌ Subdiretório ausente: ${fullPath}`);
    } else {
      console.log(`      ✅ ${subdir}/`);
    }
  }
}

// Verificar arquivos específicos
console.log('\n📄 Verificando arquivos importantes...');
for (const [dir, files] of Object.entries(expectedFiles)) {
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`❌ Arquivo ausente: ${fullPath}`);
    } else {
      console.log(`   ✅ ${fullPath}`);
    }
  }
}

// Verificar referências quebradas
console.log('\n🔗 Verificando referências...');

// Verificar se há referências aos arquivos SQL antigos
const testFiles = fs.readdirSync('scripts/test').filter(f => f.endsWith('.js'));
for (const testFile of testFiles) {
  const content = fs.readFileSync(path.join('scripts/test', testFile), 'utf8');
  
  // Verificar referências a arquivos SQL sem o novo caminho
  if (content.includes('confirm-users.sql') && !content.includes('database/migrations/confirm-users.sql')) {
    warnings.push(`⚠️  ${testFile} pode ter referência desatualizada a confirm-users.sql`);
  }
}

// Verificar .gitignore
console.log('\n🔒 Verificando .gitignore...');
const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
if (gitignoreContent.includes('config/claude-vertex-ai-key.json')) {
  console.log('   ✅ .gitignore atualizado com novas regras');
} else {
  warnings.push('⚠️  .gitignore pode não ter as novas regras para arquivos organizados');
}

// Verificar se arquivos antigos ainda existem na raiz
console.log('\n🧹 Verificando limpeza da raiz...');
const rootFiles = fs.readdirSync('.');
const shouldNotExist = [
  'test-login-simple.js',
  'confirm-users.sql',
  'claude-vertex-ai-key.json',
  'netlify.toml'
];

for (const file of shouldNotExist) {
  if (rootFiles.includes(file)) {
    errors.push(`❌ Arquivo ainda na raiz: ${file} (deveria estar organizado)`);
  }
}

// Relatório final
console.log('\n' + '='.repeat(60));
console.log('📊 RELATÓRIO DE VERIFICAÇÃO');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 PERFEITO! Organização está 100% correta!');
  console.log('✅ Todos os diretórios estão no lugar');
  console.log('✅ Todos os arquivos foram movidos corretamente');
  console.log('✅ Não há referências quebradas');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n❌ ERROS ENCONTRADOS:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  AVISOS:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  console.log('\n💡 RECOMENDAÇÕES:');
  console.log('   1. Corrija os erros listados acima');
  console.log('   2. Verifique manualmente as referências em avisos');
  console.log('   3. Execute este script novamente');
  
  process.exit(errors.length > 0 ? 1 : 0);
} 