create type agendamento_status as enum ('pendente', 'confirmado', 'concluido', 'cancelado');

create table agendamentos (
  id uuid default gen_random_uuid() primary key,
  empresa_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references auth.users(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete restrict,
  data_hora timestamp with time zone not null,
  duracao integer not null,
  preco numeric(10,2) not null,
  status agendamento_status not null default 'pendente',
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Garantir que não haja conflito de horários
  constraint agendamentos_horario_unique unique (empresa_id, data_hora),
  constraint agendamentos_horario_valido check (
    extract(minute from data_hora) in (0, 30) -- Permitir apenas horários em intervalos de 30 minutos
  )
);

-- Índices para performance
create index agendamentos_empresa_id_idx on agendamentos(empresa_id);
create index agendamentos_cliente_id_idx on agendamentos(cliente_id);
create index agendamentos_servico_id_idx on agendamentos(servico_id);
create index agendamentos_data_hora_idx on agendamentos(data_hora);
create index agendamentos_status_idx on agendamentos(status);

-- Trigger para atualizar updated_at
create trigger update_agendamentos_updated_at
  before update on agendamentos
  for each row
  execute function update_updated_at_column();

-- Políticas de segurança (RLS)
alter table agendamentos enable row level security;

-- Empresas podem ver seus próprios agendamentos
create policy "Empresas podem ver seus próprios agendamentos"
  on agendamentos for select
  using (auth.uid() = empresa_id);

-- Clientes podem ver seus próprios agendamentos
create policy "Clientes podem ver seus próprios agendamentos"
  on agendamentos for select
  using (auth.uid() = cliente_id);

-- Clientes podem criar agendamentos
create policy "Clientes podem criar agendamentos"
  on agendamentos for insert
  with check (auth.uid() = cliente_id);

-- Empresas podem atualizar status de agendamentos
create policy "Empresas podem atualizar status de agendamentos"
  on agendamentos for update
  using (auth.uid() = empresa_id)
  with check (
    auth.uid() = empresa_id
    and (
      case when old.status = 'pendente' then new.status in ('confirmado', 'cancelado')
           when old.status = 'confirmado' then new.status in ('concluido', 'cancelado')
           else false
      end
    )
  );

-- Clientes podem cancelar agendamentos pendentes
create policy "Clientes podem cancelar agendamentos pendentes"
  on agendamentos for update
  using (
    auth.uid() = cliente_id
    and old.status = 'pendente'
    and new.status = 'cancelado'
  )
  with check (
    auth.uid() = cliente_id
    and old.status = 'pendente'
    and new.status = 'cancelado'
  ); 