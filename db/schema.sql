-- ============================================================
-- Smart Printing Packaging — admin panel schema (Neon/PostgreSQL)
-- Run with: npm run db:setup   (idempotent; safe to re-run)
-- ============================================================

-- gen_random_uuid() ships in PostgreSQL 13+ core, so no extension is needed.

-- Admin users -------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- Login sessions (only a SHA-256 hash of the cookie token is stored)
create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references admin_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  user_agent text
);

create index if not exists sessions_user_idx on sessions(user_id);
create index if not exists sessions_expiry_idx on sessions(expires_at);

-- Product categories ------------------------------------------
create table if not exists categories (
  id serial primary key,
  slug text not null unique,
  title_bn text not null,
  title_en text,
  description text,
  grp text not null default 'readymade' check (grp in ('readymade', 'extra')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products ----------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id integer references categories(id) on delete set null,
  slug text not null unique,
  name_bn text not null,
  name_en text,
  price numeric(12, 2),
  price_max numeric(12, 2),
  price_unit text not null default 'kg'
    check (price_unit in ('kg', 'piece', 'packet', 'sqft', 'unit')),
  price_note text,
  min_order text,
  size_label text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  description text,
  badge text,
  wa_message text,
  service_id text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_order_idx on products(sort_order);
create index if not exists products_service_idx on products(service_id);

-- Price history keeps an audit trail of admin price changes ---
create table if not exists price_history (
  id bigserial primary key,
  product_id uuid references products(id) on delete cascade,
  old_price numeric(12, 2),
  new_price numeric(12, 2),
  changed_by text,
  changed_at timestamptz not null default now()
);

-- Editable fields layered over the code-managed service pages -
create table if not exists service_overrides (
  service_id text primary key,
  title text,
  short_summary text,
  approx text,
  approx_label text,
  facts jsonb,
  note text,
  is_active boolean not null default true,
  sort_order integer,
  updated_at timestamptz not null default now()
);

-- Landing pages built in the admin panel ----------------------
create table if not exists landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  og_image text,
  blocks jsonb not null default '[]'::jsonb,
  theme jsonb not null default '{"accent":"#142a5e","background":"#f6f4ee"}'::jsonb,
  is_published boolean not null default true,
  indexable boolean not null default true,
  show_in_nav boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Key/value site settings (contact, estimator rates, seed flag)
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
