# Plano de implementação para o Contratto

## ✅ Já Implementado

### 1. Setup e Configuração
- [x] Setup do projeto Next.js com TypeScript
- [x] Configuração do Tailwind CSS e shadcn/ui
- [x] Configuração das fontes do iFood (iFoodRCTextos e iFoodRCTitulos)
- [x] Arquivos de configuração base (.eslintrc, .prettierrc, etc.)
- [x] Configuração do Supabase para autenticação
  - [x] Setup das variáveis de ambiente
  - [x] Configuração do cliente Supabase (browser e server)
  - [x] Implementação do AuthContext
  - [x] Configuração do middleware para proteção de rotas

### 2. Componentes UI Base
- [x] Button com variantes
- [x] Card (header, content, footer)
- [x] Layout base com Header e Footer
- [x] CompanyServices (exibição de serviços)
- [x] CompanyReviews (exibição de avaliações)
- [x] PromotionCard (exibição de promoções)
- [x] Badge (componente para tags e descontos)

### 3. Página de Detalhes da Empresa
- [x] Layout completo do perfil
- [x] Exibição de informações básicas
- [x] Seção de horário de funcionamento
- [x] Lista de serviços oferecidos
- [x] Seção de avaliações
- [x] Informações de localização
- [x] Exibição de certificações

### 4. Páginas de Promoção
- [x] Página de listagem de promoções (/promocoes)
  - [x] Grid responsivo de promoções
  - [x] Barra de busca e filtros
  - [x] Tags de filtro rápido
  - [x] Paginação
- [x] Página de detalhes da promoção (/promocoes/[id])
  - [x] Galeria de imagens
  - [x] Informações detalhadas
  - [x] Preço e desconto
  - [x] Termos e condições
  - [x] Card do prestador
  - [x] Botões de ação (agendar/compartilhar)
- [x] Página 404 personalizada para promoções

### 5. Homepage
- [x] Banner principal
  - [x] Carrossel de destaques
  - [x] Call-to-action principal
- [x] Seção de categorias em destaque
  - [x] Cards interativos
  - [x] Ícones personalizados
- [x] Seção de serviços populares
  - [x] Lista de serviços mais buscados
  - [x] Avaliações em destaque

### 6. Melhorias de Acessibilidade - Banner Principal
- [x] Adicionar aria-labels nos botões de navegação
- [x] Implementar navegação por teclado
- [x] Melhorar descrições das imagens
- [x] Adicionar pause no autoplay ao focar elementos

### 7. Otimizações de Performance
- [x] Implementar lazy loading para imagens abaixo da dobra
- [x] Otimizar carregamento de fontes
- [x] Implementar cache de imagens
- [x] Adicionar Skeleton loading states
- [x] Implementar React Suspense para carregamento progressivo
  - [x] Componente de Skeleton loading
  - [x] Carregamento progressivo dos cards
  - [x] Transições suaves entre estados
  - [x] Fallback durante carregamento
  - [x] Otimização de re-renders
- [x] Remover preloads desnecessários de ícones SVG
- [x] Otimizar carregamento inicial da página

### 8. Melhorias de Acessibilidade - Categorias
- [x] Melhorar navegação por teclado
  - [x] Implementar navegação com setas
  - [x] Adicionar suporte para teclas Home/End
  - [x] Gerenciar foco corretamente
- [x] Adicionar descrições para ícones
  - [x] Melhorar labels para leitores de tela
  - [x] Adicionar descrições detalhadas para cada categoria
  - [x] Tornar ícones decorativos apropriadamente

### 9. Funcionalidades de Promoção - Busca e Filtros
- [x] Implementar busca e filtros
  - [x] Busca por texto (título, descrição e prestador)
  - [x] Filtro por localização
  - [x] Ordenação por:
    - [x] Maior desconto
    - [x] Data de validade
    - [x] Menor preço
    - [x] Melhor avaliação
  - [x] Filtros rápidos com tags
  - [x] Interface responsiva e acessível
  - [x] Filtragem em tempo real

### 10. Área da Empresa - Layout e Navegação
- [x] Layout base com navegação lateral
  - [x] Menu responsivo
  - [x] Navegação por ícones
  - [x] Suporte a temas claro/escuro
  - [x] Animações suaves
  - [x] Acessibilidade

### 11. Área da Empresa - Dashboard
- [x] Visão geral do negócio
  - [x] Total de agendamentos (dia/semana)
  - [x] Faturamento (dia/semana)
  - [x] Avaliação média
  - [x] Novos clientes
- [x] Gráficos e métricas
  - [x] Agendamentos por serviço
  - [x] Horários mais populares
- [x] Interface responsiva e moderna
- [x] Tabs para visualização diária/semanal

### 12. Área da Empresa - Gestão de Serviços
- [x] Estrutura do Banco de Dados
  - [x] Tabela de serviços
  - [x] Tabela de categorias
  - [x] Políticas de segurança (RLS)
  - [x] Triggers e funções
- [x] Cadastro de Serviços (Empresas)
  - [x] Formulário completo de serviço
  - [x] Upload de imagens
  - [x] Definição de preços
  - [x] Categorização
  - [x] Status de disponibilidade
- [x] Cadastro de Serviços (Profissionais)
  - [x] Formulário de serviço
  - [x] Portfólio de trabalhos
  - [x] Precificação
  - [x] Área de atuação
  - [x] Disponibilidade
- [x] Interface de Gerenciamento
  - [x] Listagem de serviços
  - [x] Edição de serviços
  - [x] Exclusão de serviços
  - [x] Indicadores de status
  - [x] Upload e gerenciamento de imagens

### 13. Área da Empresa - Agenda
- [x] Calendário interativo
  - [x] Seleção de data
  - [x] Localização em pt-BR
  - [x] Navegação intuitiva
- [x] Resumo diário
  - [x] Total de agendamentos
  - [x] Horários disponíveis
  - [x] Faturamento previsto
  - [x] Taxa de ocupação
- [x] Lista de agendamentos
  - [x] Detalhes do cliente
  - [x] Status do agendamento
  - [x] Ações (reagendar/cancelar)
  - [x] Badges de status

### 14. Área da Empresa - Promoções
- [x] Lista de promoções
  - [x] Tabela responsiva
  - [x] Status visual (ativa/agendada/expirada)
  - [x] Período de validade
  - [x] Preços e descontos
  - [x] Serviços inclusos
- [x] Métricas de promoções
  - [x] Total de promoções ativas
  - [x] Desconto médio
  - [x] Promoções agendadas
  - [x] Promoções expiradas

### 15. Área da Empresa - Configurações
- [x] Configurações básicas
  - [x] CNPJ e Razão Social
  - [x] Inscrição Estadual
  - [x] Responsável e CPF
  - [x] Website e Descrição
- [x] Gestão de Logo
  - [x] Upload de imagem
  - [x] Preview em tempo real
  - [x] Validações de formato e tamanho
  - [x] Integração com Supabase Storage
- [x] Endereço
  - [x] Campos com máscaras
  - [x] Validação de CEP
  - [x] Campos de endereço completo
- [x] Contatos
  - [x] Telefone com máscara
  - [x] Email
  - [x] WhatsApp com máscara
- [x] Notificações
  - [x] Configuração por canal (email, SMS, WhatsApp)
  - [x] Frequência de notificações
  - [x] Tipos de notificação por canal
- [x] Horários de Funcionamento
  - [x] Configuração por dia da semana
  - [x] Horários personalizados
  - [x] Controle de feriados
  - [x] Exceções de horário

### 16. Página de Profissionais
- [x] Layout completo da página
  - [x] Barra de busca e filtros
  - [x] Navegação por categorias
  - [x] Sistema de scroll horizontal com setas
  - [x] Cards de profissionais
- [x] Sistema de categorias
  - [x] Categorias principais
    - [x] Serviços Gerais & Manutenção
    - [x] Instalações & Técnicos
    - [x] Beleza, Moda & Bem-estar
    - [x] Saúde & Terapias
    - [x] Educação & Aulas
    - [x] Design & Tecnologia
    - [x] Serviços Automotivos
    - [x] Eventos & Produção
    - [x] Serviços para Pets
  - [x] Subcategorias detalhadas para cada categoria
  - [x] Sistema de filtragem por categoria/subcategoria
- [x] Cards de profissionais
  - [x] Foto do profissional
  - [x] Nome e especialidade
  - [x] Avaliação e número de reviews
  - [x] Tempo médio de atendimento
  - [x] Distância
  - [x] Serviços em destaque
  - [x] Badges de promoção/destaque
- [x] Perfil do profissional
  - [x] Informações pessoais
  - [x] Especialidades
  - [x] Experiência e formação
  - [x] Portfólio
  - [x] Avaliações
  - [x] Área de atuação
  - [x] Horários de trabalho

### 17. Página de Serviços
- [x] Layout completo da página
  - [x] Barra de busca e filtros
  - [x] Navegação por categorias empresariais
  - [x] Sistema de scroll horizontal com setas
  - [x] Cards de empresas/serviços
- [x] Sistema de categorias empresariais
  - [x] Serviços Empresariais
  - [x] Marketing & Comunicação
  - [x] Tecnologia & Desenvolvimento
  - [x] Logística & Transporte
  - [x] Treinamento & Educação Corporativa
  - [x] Engenharia & Arquitetura
  - [x] Serviços Ambientais
  - [x] Manutenção & Instalações Comerciais
  - [x] Eventos Corporativos
  - [x] Serviços para Indústrias
  - [x] Serviços de Saúde e Bem-Estar
- [x] Cards de empresas
  - [x] Logo/imagem da empresa
  - [x] Nome e categoria
  - [x] Avaliação e número de reviews
  - [x] Tempo médio de atendimento
  - [x] Distância
  - [x] Serviços em destaque
  - [x] Badge de empresa parceira

### 18. Sistema de Autenticação e Perfis
- [x] Configuração do Supabase Auth
  - [x] Setup das variáveis de ambiente
  - [x] Configuração do cliente Supabase
  - [x] Implementação do AuthContext
  - [x] Configuração do middleware para proteção de rotas
- [x] Sistema de Perfis
  - [x] Tabela profiles no banco de dados
  - [x] Trigger para criação automática de perfil
  - [x] Políticas de segurança (RLS)
  - [x] Tipos de usuário:
    - [x] Cliente
    - [x] Profissional
    - [x] Empresa
    - [x] Admin
- [x] Gestão de Perfil
  - [x] Informações básicas
    - [x] Nome
    - [x] Email
    - [x] Telefone
    - [x] CPF
    - [x] Data de nascimento
  - [x] Endereço
    - [x] CEP
    - [x] Rua
    - [x] Número
    - [x] Complemento
    - [x] Bairro
    - [x] Cidade
    - [x] Estado
  - [x] Perfil Profissional
    - [x] Especialidades
    - [x] Experiência
    - [x] Formação
    - [x] Certificações
    - [x] Portfólio
  - [x] Perfil Empresa
    - [x] Razão Social
    - [x] CNPJ
    - [x] Descrição
    - [x] Horários de funcionamento
    - [x] Área de atuação
- [x] Interface do Usuário
  - [x] Páginas de login e cadastro
  - [x] Menu de usuário com avatar
  - [x] Páginas de perfil por tipo de usuário
  - [x] Upload e gerenciamento de avatar
  - [x] Notificações

### 19. Interface do Usuário e Componentes
- [x] Biblioteca de Componentes Base (shadcn/ui)
  - [x] Button com variantes
  - [x] Input e Form Controls
  - [x] Card e Layout Components
  - [x] Dialog e Modal
  - [x] Dropdown e Select
  - [x] Avatar e Image
  - [x] Sheet e Sidebar
  - [x] Scroll Area
  - [x] Separator
  - [x] Popover
  - [x] Toast Notifications
- [x] Layouts Específicos
  - [x] Layout Principal
    - [x] Header com logo e navegação
    - [x] Menu de usuário com avatar
    - [x] Notificações
    - [x] Responsividade
  - [x] Layout da Empresa
    - [x] Sidebar com navegação
    - [x] Dashboard
    - [x] Área de serviços
    - [x] Configurações
  - [x] Layout do Cliente
    - [x] Sidebar com navegação
    - [x] Agendamentos
    - [x] Favoritos
    - [x] Avaliações
  - [x] Layout do Profissional
    - [x] Perfil público
    - [x] Área administrativa
    - [x] Portfólio
- [x] Componentes de Busca
  - [x] Barra de busca com filtros
  - [x] Ordenação
  - [x] Filtros avançados
  - [x] Busca por localização
- [x] Componentes de Listagem
  - [x] Cards responsivos
  - [x] Grid adaptativo
  - [x] Paginação
  - [x] Loading states
- [x] Componentes de Feedback
  - [x] Toast notifications
  - [x] Loading spinners
  - [x] Skeleton loading
  - [x] Error states

### 20. Responsividade e Adaptação Mobile
- [x] Breakpoints definidos
  - [x] Mobile: < 640px
  - [x] Tablet: 640px - 1024px
  - [x] Desktop: > 1024px
- [x] Adaptações por Dispositivo
  - [x] Mobile
    - [x] Menu hamburger
    - [x] Cards em coluna única
    - [x] Formulários simplificados
  - [x] Tablet
    - [x] Menu expandido
    - [x] Grid de 2 colunas
    - [x] Sidebars colapsáveis
  - [x] Desktop
    - [x] Menu completo
    - [x] Grid de 3+ colunas
    - [x] Layout expandido

## 🚨 PRIORIDADE 1 - ESSENCIAL PARA LANÇAMENTO

### 1. Correções Críticas de Roteamento
> Por que: Rotas duplicadas causam confusão para usuários e problemas de SEO
- [x] Consolidar rotas duplicadas
  - [x] Mover `(empresa)` para `dashboard/empresa`
  - [x] Mover `(client)` para `dashboard/cliente`
  - [x] Atualizar todos os links internos
  - [x] Implementar redirecionamentos
- [x] Validar redirecionamentos
  - [x] Testar todos os cenários de redirecionamento
  - [x] Verificar preservação de parâmetros de query
  - [x] Garantir que não há loops de redirecionamento

### 2. Funcionalidades Core do Negócio
> Por que: Funcionalidades essenciais para o funcionamento básico do marketplace
- [ ] Sistema de Agendamento
  - [x] Interface base do calendário
  - [x] Layout da página de agendamentos
  - [x] Seleção de prestador
  - [x] Seleção de serviço
  - [x] Seleção de horário
  - [x] Formulário de agendamento
  - [x] Criação de agendamento
  - [x] Cancelamento de agendamento
  - [ ] Reagendamento
  - [ ] Notificações de agendamento
  - [ ] Confirmação de agendamento pelo prestador
  - [ ] Lembrete de agendamento
  - [ ] Avaliação pós-serviço
- [ ] Sistema de Pagamento
  - [ ] Integração Mercado Pago
    - [ ] Configuração do ambiente
    - [ ] Implementação do checkout
    - [ ] Tratamento de webhooks
  - [ ] Fluxo de pagamento seguro
    - [ ] Validação de transações
    - [ ] Tratamento de erros
    - [ ] Página de sucesso/erro
  - [ ] Split de pagamentos
    - [ ] Configuração de taxas
    - [ ] Regras de divisão
    - [ ] Relatórios financeiros
- [x] Perfil de Cliente
  - [x] Dashboard com métricas
  - [x] Gestão de agendamentos
  - [x] Lista de favoritos
  - [x] Histórico de avaliações
  - [x] Configurações da conta

### 3. Performance e Segurança Crítica
> Por que: Garantir que o site seja rápido e seguro para o lançamento
- [x] Otimizações Críticas
  - [x] Lazy loading de imagens
  - [x] Redução de bundle size
  - [x] Cache estratégico
  - [x] Otimização de componentes
    - [x] Memoização de componentes pesados
    - [x] Redução de re-renders
    - [x] Code splitting
- [x] Segurança Básica
  - [x] Proteção de rotas
    - [x] Middleware de autenticação
    - [x] Regras de autorização
    - [x] Redirecionamentos seguros
  - [x] Validação de inputs
    - [x] Implementar Zod em todos os formulários
    - [x] Sanitização de dados
    - [x] Validação no servidor
  - [x] Rate limiting básico
    - [x] Configurar limites por IP
    - [x] Proteção contra DDoS
    - [x] Cache de requisições

### 4. UX Essencial
> Por que: Garantir uma experiência básica mas sólida para os usuários
- [ ] Feedback de Ações
  - [ ] Toast notifications
    - [ ] Sucesso/erro em operações
    - [ ] Notificações de sistema
    - [ ] Alertas importantes
  - [ ] Loading states
    - [ ] Skeleton loading
    - [ ] Spinners
    - [ ] Progress bars
  - [ ] Mensagens de erro amigáveis
    - [ ] Tratamento de erros de API
    - [ ] Sugestões de resolução
    - [ ] Feedback visual claro
- [x] Responsividade
  - [x] Correções mobile
  - [x] Menu adaptativo
  - [x] Formulários responsivos
- [ ] Melhorias de Formulários
  - [ ] Máscaras de input
    - [ ] CPF/CNPJ
    - [ ] Telefone
    - [ ] CEP
    - [ ] Data/Hora
    - [ ] Autocomplete de endereço
    - [ ] Persistência de dados

### 5. Autenticação e Cadastro de Serviços
> Por que: Funcionalidades fundamentais para operação do marketplace
- [ ] Sistema de Autenticação e Cadastro
  - [x] Login
    - [x] Cliente
    - [x] Profissional
    - [x] Empresa
  - [x] Cadastro
    - [x] Formulário de Cliente
      - [x] Dados pessoais básicos
      - [x] Validação de email
      - [x] Confirmação de senha
    - [x] Formulário de Profissional
      - [x] Dados pessoais
      - [x] Documentação profissional
      - [x] Área de atuação
      - [x] Validação de documentos
    - [x] Formulário de Empresa
      - [x] Dados empresariais
      - [x] CNPJ e documentação
      - [x] Área de atuação
      - [x] Validação de documentos
  - [ ] Validação e Moderação
    - [x] Sistema de aprovação de profissionais
    - [x] Sistema de aprovação de empresas
    - [x] Verificação de documentos (implementar validação real de CPF/CNPJ)
    - [x] Notificação de status (implementar sistema de emails)

- [ ] Visibilidade Controlada
  - [x] Filtro de exibição
    - [x] Mostrar apenas profissionais aprovados
    - [x] Mostrar apenas empresas aprovadas
    - [x] Mostrar apenas serviços ativos
  - [x] Sistema de Status
    - [x] Indicador de perfil verificado
    - [x] Badge de profissional aprovado
    - [x] Badge de empresa verificada
  - [x] Moderação de Conteúdo
    - [x] Revisão de serviços cadastrados
    - [x] Validação de informações
    - [x] Sistema de denúncias

## 🏃 PRIORIDADE 2 - PÓS-LANÇAMENTO IMEDIATO

### 1. Melhorias de Conversão
> Por que: Aumentar taxas de conversão logo após o lançamento
- [ ] Otimização de Funil
  - [ ] Simplificar cadastro
  - [ ] Reduzir fricção no agendamento
  - [ ] Melhorar página de serviços
- [ ] Analytics
  - [ ] Google Analytics
  - [ ] Eventos de conversão
  - [ ] Dashboard de métricas

### 2. Expansão de Funcionalidades
> Por que: Features que melhoram a experiência mas não são bloqueantes
- [x] Sistema de Avaliações
  - [x] Reviews de serviços
  - [x] Moderação de comentários
  - [x] Ranking de profissionais
- [ ] Notificações
  - [ ] Sistema de lembretes
  - [ ] Notificações push
  - [ ] Integração WhatsApp

## 📈 PRIORIDADE 3 - OTIMIZAÇÕES CONTÍNUAS

### 1. Performance Avançada
> Por que: Melhorar ainda mais a experiência do usuário
- [ ] Otimizações de Carregamento
  - [ ] SSR estratégico
  - [ ] Core Web Vitals
  - [ ] PWA básico
- [ ] Cache Avançado
  - [ ] Cache de API
  - [ ] Cache de imagens
  - [ ] Prefetching

### 2. Experiência Premium
> Por que: Funcionalidades que destacam o produto
- [ ] Features Avançadas
  - [ ] Chat integrado
  - [ ] Área VIP
  - [ ] Sistema de fidelidade
- [ ] Integrações
  - [ ] Google Calendar
  - [ ] ERPs
  - [ ] APIs terceiros

## 📋 CHECKLIST DE LANÇAMENTO

### 1. Pré-Lançamento
- [ ] Testes Finais
  - [ ] Teste de carga
  - [ ] Teste de segurança
  - [ ] Teste de usabilidade
- [ ] Documentação
  - [ ] Guia do usuário
  - [ ] FAQ inicial
  - [ ] Políticas e termos

### 2. Lançamento
- [ ] Infraestrutura
  - [ ] Monitoramento
  - [ ] Backup automático
  - [ ] SSL/HTTPS
- [ ] Marketing
  - [ ] Anúncios iniciais
  - [ ] Email marketing
  - [ ] Redes sociais

### 3. Pós-Lançamento
- [ ] Suporte
  - [ ] Canal de atendimento
  - [ ] Base de conhecimento
  - [ ] Feedback loop
- [ ] Análise
  - [ ] Métricas iniciais
  - [ ] Ajustes de performance
  - [ ] Planejamento de melhorias

## 🎯 PRÓXIMOS PASSOS IMEDIATOS
1. ~~Implementar sistema completo de autenticação e cadastro~~ ✅
2. ~~Desenvolver fluxo de aprovação de profissionais e empresas~~ ✅
3. ~~Criar sistema de cadastro e gestão de serviços~~ ✅
4. ~~Implementar visibilidade controlada de perfis e serviços~~ ✅
5. ~~Iniciar correções de roteamento (conflitos atuais)~~ ✅
6. Implementar sistema de pagamento (Mercado Pago)
7. Finalizar funcionalidades core (agendamento)
8. ~~Otimizar performance crítica (lazy loading)~~ ✅
9. Preparar checklist de lançamento

## 📝 NOTAS IMPORTANTES
- Foco em MVP funcional
- Priorizar experiência do usuário
- Garantir segurança básica
- Monitorar métricas essenciais
- Priorizar implementação do sistema de pagamento
- Finalizar funcionalidades de agendamento pendentes
- Preparar documentação para lançamento