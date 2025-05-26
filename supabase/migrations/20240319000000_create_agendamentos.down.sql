-- Remover políticas de segurança
drop policy if exists "Empresas podem ver seus próprios agendamentos" on agendamentos;
drop policy if exists "Clientes podem ver seus próprios agendamentos" on agendamentos;
drop policy if exists "Clientes podem criar agendamentos" on agendamentos;
drop policy if exists "Empresas podem atualizar status de agendamentos" on agendamentos;
drop policy if exists "Clientes podem cancelar agendamentos pendentes" on agendamentos;

-- Remover trigger
drop trigger if exists update_agendamentos_updated_at on agendamentos;

-- Remover índices
drop index if exists agendamentos_empresa_id_idx;
drop index if exists agendamentos_cliente_id_idx;
drop index if exists agendamentos_servico_id_idx;
drop index if exists agendamentos_data_hora_idx;
drop index if exists agendamentos_status_idx;

-- Remover tabela
drop table if exists agendamentos;

-- Remover tipo
drop type if exists agendamento_status; 