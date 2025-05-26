-- Remover políticas de segurança
drop policy if exists "Empresas podem ver seus próprios serviços" on servicos;
drop policy if exists "Empresas podem inserir seus próprios serviços" on servicos;
drop policy if exists "Empresas podem atualizar seus próprios serviços" on servicos;
drop policy if exists "Empresas podem excluir seus próprios serviços" on servicos;

-- Remover trigger e função
drop trigger if exists update_servicos_updated_at on servicos;
drop function if exists update_updated_at_column();

-- Remover índices
drop index if exists servicos_empresa_id_idx;
drop index if exists servicos_nome_idx;
drop index if exists servicos_categoria_idx;
drop index if exists servicos_status_idx;

-- Remover tabela
drop table if exists servicos;

-- Remover tipo
drop type if exists servico_status; 