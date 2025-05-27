# Guia de Configuração do Ambiente

Este guia resolve os problemas identificados nos logs do servidor de desenvolvimento.

## 🔧 Problemas Identificados e Soluções

### 1. Configuração do Pusher ⚠️

**Problema**: `Pusher server environment variables are not properly configured`

**Solução**: Criar arquivo `.env.local` na raiz do projeto:

```bash
# Copie este conteúdo para .env.local
NEXT_PUBLIC_PUSHER_KEY=fffe5c1d86e941f2a9f1
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
PUSHER_APP_ID=1997737
PUSHER_SECRET=your_pusher_secret_here
```

**Para produção**: Obtenha credenciais reais em [pusher.com](https://pusher.com/)

### 2. Ícone Ausente ✅

**Problema**: `The requested resource isn't a valid image for /icons/maintenance.svg`

**Status**: ✅ **RESOLVIDO** - Ícone criado em `public/icons/maintenance.svg`

### 3. Imagens do Unsplash ⚠️

**Problema**: `upstream image response failed for https://images.unsplash.com/...`

**Causa**: URLs específicas retornando 404

**URLs problemáticas identificadas**:
- `photo-1558618047-3c8c76ca7d13` (erro nos logs)
- `photo-1669392907654-4e766e286a38` (erro nos logs)

**Solução temporária**: As imagens têm fallbacks configurados no código

**Solução definitiva**: Substituir por imagens locais ou URLs válidas

### 4. Aviso de Depreciação 📝

**Problema**: `[DEP0040] DeprecationWarning: The punycode module is deprecated`

**Status**: ✅ **CONFIGURADO** - Aviso suprimido no `next.config.js`

## 🚀 Passos para Configuração Completa

### 1. Criar arquivo de ambiente

```bash
# Na raiz do projeto, crie o arquivo .env.local
touch .env.local
```

Adicione o conteúdo:
```env
NEXT_PUBLIC_PUSHER_KEY=fffe5c1d86e941f2a9f1
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
PUSHER_APP_ID=1997737
PUSHER_SECRET=your_pusher_secret_here
NODE_ENV=development
```

### 2. Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

### 3. Verificar funcionamento

```bash
# Execute os testes
npm run test:auth
npm run verify-organization
```

## 📊 Status dos Problemas

| Problema | Status | Ação |
|----------|--------|------|
| Configuração Pusher | ⚠️ Pendente | Criar `.env.local` |
| Ícone maintenance.svg | ✅ Resolvido | Ícone criado |
| Imagens Unsplash | ⚠️ Parcial | URLs com fallback |
| Aviso punycode | ✅ Resolvido | Suprimido no config |

## 🔍 Verificação Final

Após a configuração, os logs devem mostrar:
- ✅ Sem avisos do Pusher
- ✅ Ícone maintenance.svg carregando
- ✅ Sem avisos de depreciação
- ⚠️ Possíveis avisos de imagens (não críticos)

## 📚 Documentação Relacionada

- [Configuração do Pusher](./pusher-setup.md)
- [Organização de Arquivos](./ORGANIZACAO_ARQUIVOS.md)
- [Scripts de Teste](../../scripts/test/README.md)

## 🆘 Suporte

Se os problemas persistirem:
1. Verifique se o arquivo `.env.local` foi criado corretamente
2. Reinicie o servidor de desenvolvimento
3. Execute `npm run verify-organization` para verificar a estrutura
4. Consulte os logs detalhados no terminal 