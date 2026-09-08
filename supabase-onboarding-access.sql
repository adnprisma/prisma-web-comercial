-- Ejecutar en Supabase SQL Editor.
-- Agrega acceso por codigo para clientes sin tocar el dashboard de vendedoras.

alter table public.clients
  add column if not exists onboarding_access_code text,
  add column if not exists onboarding_enabled boolean not null default false,
  add column if not exists onboarding_last_accessed_at timestamptz;

create unique index if not exists clients_onboarding_access_code_idx
  on public.clients (upper(onboarding_access_code))
  where onboarding_access_code is not null;

create or replace function public.verify_onboarding_access(p_access_code text)
returns table (
  client_id uuid,
  client_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_access_code, '')));
begin
  if v_code = '' then
    return;
  end if;

  return query
  update public.clients c
     set onboarding_last_accessed_at = now()
   where c.onboarding_enabled is true
     and c.status <> 'cancelled'
     and upper(c.onboarding_access_code) = v_code
  returning c.id, c.name;
end;
$$;

grant execute on function public.verify_onboarding_access(text) to anon, authenticated;

-- Ejemplo para activar un cliente existente:
-- update public.clients
--    set onboarding_access_code = 'PROTESIS-PRISMA-001',
--        onboarding_enabled = true
--  where name = 'Nombre del cliente';
