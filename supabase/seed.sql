-- Inserir categorias iniciais
insert into servicos (empresa_id, nome, descricao, preco, duracao, categoria, status)
values
  ('00000000-0000-0000-0000-000000000000', 'Corte Masculino', 'Corte de cabelo masculino tradicional', 35.00, 30, 'Cabelo', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Corte Feminino', 'Corte de cabelo feminino', 70.00, 60, 'Cabelo', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Manicure', 'Tratamento e esmaltação das unhas das mãos', 35.00, 45, 'Unhas', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Pedicure', 'Tratamento e esmaltação das unhas dos pés', 45.00, 60, 'Unhas', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Maquiagem Social', 'Maquiagem para eventos sociais', 120.00, 60, 'Maquiagem', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Limpeza de Pele', 'Limpeza de pele profunda', 150.00, 90, 'Estética', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Massagem Relaxante', 'Massagem corporal relaxante', 100.00, 60, 'Massagem', 'ativo'),
  ('00000000-0000-0000-0000-000000000000', 'Depilação Perna Completa', 'Depilação com cera da perna inteira', 80.00, 60, 'Depilação', 'ativo');

-- Inserir serviços de exemplo
insert into servicos (id, empresa_id, nome, descricao, preco, duracao, categoria, status)
values
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'empresa-id-1', 'Corte Masculino', 'Corte de cabelo masculino tradicional', 40.00, 30, 'Cabelo', 'ativo'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'empresa-id-1', 'Barba', 'Barba completa com acabamento', 35.00, 30, 'Barba', 'ativo'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0853', 'empresa-id-1', 'Corte + Barba', 'Corte masculino + barba completa', 70.00, 60, 'Combo', 'ativo'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0854', 'empresa-id-1', 'Coloração', 'Coloração de cabelo completa', 120.00, 90, 'Cabelo', 'ativo'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0855', 'empresa-id-1', 'Hidratação', 'Hidratação capilar profunda', 80.00, 45, 'Tratamento', 'ativo');

-- Inserir agendamentos de exemplo
insert into agendamentos (id, empresa_id, cliente_id, servico_id, data_hora, duracao, preco, status, observacoes)
values
  (
    'd290f1ee-6c54-4b01-90e6-d701748f0861',
    'empresa-id-1',
    'cliente-id-1',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    now() + interval '2 hours',
    30,
    40.00,
    'pendente',
    'Cliente novo'
  ),
  (
    'd290f1ee-6c54-4b01-90e6-d701748f0862',
    'empresa-id-1',
    'cliente-id-2',
    'd290f1ee-6c54-4b01-90e6-d701748f0853',
    now() + interval '4 hours',
    60,
    70.00,
    'confirmado',
    null
  ),
  (
    'd290f1ee-6c54-4b01-90e6-d701748f0863',
    'empresa-id-1',
    'cliente-id-3',
    'd290f1ee-6c54-4b01-90e6-d701748f0852',
    now() + interval '1 day',
    30,
    35.00,
    'pendente',
    'Primeira vez fazendo a barba'
  ),
  (
    'd290f1ee-6c54-4b01-90e6-d701748f0864',
    'empresa-id-1',
    'cliente-id-4',
    'd290f1ee-6c54-4b01-90e6-d701748f0854',
    now() + interval '2 days',
    90,
    120.00,
    'confirmado',
    'Coloração loiro platinado'
  ),
  (
    'd290f1ee-6c54-4b01-90e6-d701748f0865',
    'empresa-id-1',
    'cliente-id-5',
    'd290f1ee-6c54-4b01-90e6-d701748f0855',
    now() + interval '3 days',
    45,
    80.00,
    'pendente',
    null
  ); 