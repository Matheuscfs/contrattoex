create or replace function horarios_disponiveis(
  p_empresa_id uuid,
  p_data date,
  p_duracao_servico int
)
returns table (
  horario timestamp with time zone
)
language plpgsql
as $$
declare
  v_hora_inicio time := '08:00:00'::time;
  v_hora_fim time := '18:00:00'::time;
  v_intervalo interval := '30 minutes'::interval;
  v_horario timestamp with time zone;
  v_horario_fim timestamp with time zone;
begin
  -- Loop através dos horários possíveis do dia
  v_horario := (p_data + v_hora_inicio)::timestamp with time zone;
  v_horario_fim := (p_data + v_hora_fim)::timestamp with time zone;

  while v_horario < v_horario_fim loop
    -- Verificar se o horário está disponível
    if not exists (
      select 1
      from agendamentos a
      where a.empresa_id = p_empresa_id
        and a.status != 'cancelado'
        and (
          -- Verifica se há sobreposição de horários
          (a.data_hora <= v_horario and (a.data_hora + (a.duracao || ' minutes')::interval) > v_horario)
          or
          (a.data_hora < (v_horario + (p_duracao_servico || ' minutes')::interval) and a.data_hora >= v_horario)
        )
    ) then
      return next v_horario;
    end if;

    v_horario := v_horario + v_intervalo;
  end loop;

  return;
end;
$$; 