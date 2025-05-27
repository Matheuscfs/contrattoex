# Fluxograma do iServiços

## 🌐 Estrutura de Rotas

```mermaid
graph TD
    A[Homepage] --> B[Área Pública]
    A --> C[Área Autenticada]
    
    %% Área Pública
    B --> D[/servicos]
    B --> E[/empresas]
    B --> F[/profissionais]
    B --> G[/promocoes]
    
    %% Autenticação
    A --> H[/entrar]
    A --> I[/criar-conta]
    
    %% Área Autenticada
    C --> J[Área da Empresa]
    C --> K[Área do Cliente]
    C --> L[Área do Profissional]
    
    %% Detalhamento Empresa
    J --> M[/(empresa)/dashboard]
    J --> N[/(empresa)/servicos]
    J --> O[/(empresa)/agenda]
    J --> P[/(empresa)/promocoes]
    J --> Q[/(empresa)/configuracoes]
    
    %% Detalhamento Cliente
    K --> R[/(client)/perfil]
    K --> S[/(client)/agendamentos]
    K --> T[/(client)/favoritos]
    K --> U[/(client)/avaliacoes]
    
    %% Detalhamento Profissional
    L --> V[/profissional/dashboard]
    L --> W[/profissional/servicos]
    L --> X[/profissional/agenda]
    L --> Y[/profissional/avaliacoes]
```

## 📱 Fluxos Principais

### 1. Fluxo de Cadastro e Login

```mermaid
sequenceDiagram
    participant U as Usuário
    participant H as Homepage
    participant R as Registro
    participant L as Login
    participant D as Dashboard
    
    U->>H: Acessa site
    U->>R: Clica em "Criar Conta"
    R->>R: Preenche dados
    R->>L: Redireciona para login
    L->>L: Faz login
    L->>D: Acessa dashboard
```

### 2. Fluxo de Busca e Agendamento

```mermaid
sequenceDiagram
    participant U as Usuário
    participant S as Busca
    participant E as Empresa
    participant A as Agendamento
    participant C as Confirmação
    
    U->>S: Busca serviço
    S->>E: Seleciona empresa
    E->>A: Escolhe serviço
    A->>A: Seleciona data/hora
    A->>C: Confirma agendamento
```

## 🗺️ Mapa do Site

### Área Pública
- **/**
  - Página inicial
  - Banner principal
  - Categorias em destaque
  - Serviços populares
  - Promoções ativas

- **/servicos**
  - Listagem de serviços
  - Filtros por categoria
  - Busca avançada
  - Ordenação por relevância/preço

- **/empresas**
  - Diretório de empresas
  - Filtros por localização
  - Avaliações e reviews
  - Categorias de serviço

- **/profissionais**
  - Lista de profissionais
  - Filtros por especialidade
  - Avaliações
  - Disponibilidade

- **/promocoes**
  - Ofertas ativas
  - Filtros por categoria
  - Ordenação por desconto
  - Validade das promoções

### Área da Empresa
- **/(empresa)/dashboard**
  - Visão geral
  - Métricas principais
  - Agendamentos do dia
  - Notificações

- **/(empresa)/servicos**
  - Cadastro de serviços
  - Gestão de preços
  - Disponibilidade
  - Categorização

- **/(empresa)/agenda**
  - Calendário de agendamentos
  - Gestão de horários
  - Confirmações
  - Histórico

- **/(empresa)/promocoes**
  - Criação de promoções
  - Gestão de descontos
  - Períodos de validade
  - Métricas de conversão

### Área do Cliente
- **/(client)/perfil**
  - Dados pessoais
  - Endereços
  - Preferências
  - Histórico

- **/(client)/agendamentos**
  - Agendamentos ativos
  - Histórico
  - Reagendamentos
  - Cancelamentos

- **/(client)/favoritos**
  - Empresas favoritas
  - Serviços salvos
  - Profissionais preferidos

### Área do Profissional
- **/profissional/dashboard**
  - Visão geral
  - Agenda do dia
  - Métricas de desempenho
  - Notificações

- **/profissional/servicos**
  - Serviços oferecidos
  - Precificação
  - Disponibilidade
  - Especialidades

## 🔄 Estados e Transições

### Estados de Agendamento
```mermaid
stateDiagram-v2
    [*] --> Solicitado
    Solicitado --> Confirmado
    Solicitado --> Cancelado
    Confirmado --> EmAndamento
    EmAndamento --> Concluído
    EmAndamento --> Cancelado
    Concluído --> Avaliado
    Concluído --> [*]
    Cancelado --> [*]
    Avaliado --> [*]
```

### Estados de Usuário
```mermaid
stateDiagram-v2
    [*] --> NaoAutenticado
    NaoAutenticado --> Registrado
    Registrado --> Autenticado
    Autenticado --> PerfilCompleto
    PerfilCompleto --> Verificado
    Verificado --> [*]
```

## 📊 Hierarquia de Componentes

```mermaid
graph TD
    A[Layout Principal] --> B[Header]
    A --> C[Footer]
    A --> D[Conteúdo Principal]
    
    D --> E[Componentes de Página]
    E --> F[CompanyHeader]
    E --> G[ServiceList]
    E --> H[ReviewSection]
    
    D --> I[Componentes Compartilhados]
    I --> J[Button]
    I --> K[Card]
    I --> L[Modal]
    
    D --> M[Formulários]
    M --> N[LoginForm]
    M --> O[RegisterForm]
    M --> P[ServiceForm]
```

## 🔐 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as Auth API
    participant D as Database
    
    U->>F: Tenta acessar rota protegida
    F->>A: Verifica token
    A->>D: Valida sessão
    D-->>A: Retorna status
    A-->>F: Token válido/inválido
    F-->>U: Permite/Redireciona
```

## 📱 Responsividade

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Adaptações por Dispositivo
- **Mobile**
  - Menu hamburger
  - Cards em coluna única
  - Formulários simplificados

- **Tablet**
  - Menu expandido
  - Grid de 2 colunas
  - Sidebars colapsáveis

- **Desktop**
  - Menu completo
  - Grid de 3+ colunas
  - Layout expandido
