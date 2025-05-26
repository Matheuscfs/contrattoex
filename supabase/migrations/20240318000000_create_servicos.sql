create type servico_status as enum ('ativo', 'inativo');

create table servicos (
  id uuid default gen_random_uuid() primary key,
  empresa_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  descricao text not null,
  preco numeric(10,2) not null check (preco > 0),
  duracao integer not null check (duracao > 0),
  categoria text not null,
  status servico_status not null default 'ativo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices para melhorar a performance
create index servicos_empresa_id_idx on servicos(empresa_id);
create index servicos_nome_idx on servicos(nome);
create index servicos_categoria_idx on servicos(categoria);
create index servicos_status_idx on servicos(status);

-- Criar função para atualizar o updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Criar trigger para atualizar o updated_at
create trigger update_servicos_updated_at
  before update on servicos
  for each row
  execute function update_updated_at_column();

-- Criar políticas de segurança
alter table servicos enable row level security;

create policy "Empresas podem ver seus próprios serviços"
  on servicos for select
  using (auth.uid() = empresa_id);

create policy "Empresas podem inserir seus próprios serviços"
  on servicos for insert
  with check (auth.uid() = empresa_id);

create policy "Empresas podem atualizar seus próprios serviços"
  on servicos for update
  using (auth.uid() = empresa_id)
  with check (auth.uid() = empresa_id);

create policy "Empresas podem excluir seus próprios serviços"
  on servicos for delete
  using (auth.uid() = empresa_id); 