-- FILE: supabase/schema.sql

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

create table scripts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null default 'Sin título',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table nodes (
  id uuid default gen_random_uuid() primary key,
  script_id uuid references scripts(id) on delete cascade,
  title text not null default 'Escena',
  position_x float not null default 0,
  position_y float not null default 0,
  created_at timestamptz default now()
);

create table blocks (
  id uuid default gen_random_uuid() primary key,
  node_id uuid references nodes(id) on delete cascade,
  type text not null check (type in ('script','prompt','note','code','asset')),
  content text default '',
  asset_url text,
  position int default 0,
  created_at timestamptz default now()
);

create table edges (
  id uuid default gen_random_uuid() primary key,
  script_id uuid references scripts(id) on delete cascade,
  from_node uuid references nodes(id) on delete cascade,
  to_node uuid references nodes(id) on delete cascade
);

-- RLS
alter table scripts enable row level security;
alter table nodes enable row level security;
alter table blocks enable row level security;
alter table edges enable row level security;
alter table profiles enable row level security;

-- Cualquier usuario autenticado tiene acceso total a todo
create policy "authenticated full access scripts" on scripts for all using (auth.role() = 'authenticated');
create policy "authenticated full access nodes" on nodes for all using (auth.role() = 'authenticated');
create policy "authenticated full access blocks" on blocks for all using (auth.role() = 'authenticated');
create policy "authenticated full access edges" on edges for all using (auth.role() = 'authenticated');
create policy "authenticated full access profiles" on profiles for all using (auth.role() = 'authenticated');
