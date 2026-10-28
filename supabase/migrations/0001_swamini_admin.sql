-- =====================================================================
-- Swamini Gruh Udyog — products, site settings and admin access
-- Run once in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run: tables/policies are created only if missing,
-- seed rows are inserted only if absent.
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_mr         text not null check (length(trim(name_mr)) > 0),
  name_en         text not null check (length(trim(name_en)) > 0),
  description_mr  text not null default '',
  description_en  text not null default '',
  price           integer not null check (price > 0 and price < 100000),  -- ₹ per kg
  category        text not null check (category in ('sweet', 'namkeen', 'flour')),
  tag             text check (tag in ('ghee', 'oil')),
  image_url       text,                                  -- Google Drive share link
  is_featured     boolean not null default false,
  is_available    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  updated_by      text
);

create index if not exists products_sort_idx on public.products (sort_order, name_en);

create table if not exists public.site_settings (
  id                 smallint primary key default 1 check (id = 1),  -- single row
  phone              text not null check (phone ~ '^[0-9]{10}$'),
  upi                text not null check (upi ~ '^[0-9]{10}$'),
  fssai              text not null default '',
  order_deadline     date,                                -- null = no deadline shown
  orders_open        boolean not null default true,
  years_of_service   integer not null default 16 check (years_of_service between 1 and 200),
  brochure_url       text,                                -- Google Drive share link
  updated_at         timestamptz not null default now(),
  updated_by         text
);

create table if not exists public.admin_emails (
  email text primary key check (email = lower(email))
);

-- ---------- Helpers ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.jwt() ->> 'email';
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before insert or update on public.products
  for each row execute function public.touch_updated();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated();

-- ---------- Row Level Security ----------
alter table public.products      enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_emails  enable row level security;   -- no policies: hidden from the API

drop policy if exists "products: public read available" on public.products;
create policy "products: public read available" on public.products
  for select to anon, authenticated
  using (is_available or (select public.is_admin()));

drop policy if exists "products: admin insert" on public.products;
create policy "products: admin insert" on public.products
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "products: admin update" on public.products;
create policy "products: admin update" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "products: admin delete" on public.products;
create policy "products: admin delete" on public.products
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "settings: public read" on public.site_settings;
create policy "settings: public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings: admin update" on public.site_settings;
create policy "settings: admin update" on public.site_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Explicit API grants (RLS above still decides which rows)
grant select on public.products, public.site_settings to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant update on public.site_settings to authenticated;

-- ---------- Seed: 2026 Diwali card ----------
insert into public.site_settings (id, phone, upi, fssai, order_deadline, orders_open, years_of_service)
values (1, '8149178200', '9421450704', '21524044002045', '2026-10-31', true, 16)
on conflict (id) do nothing;

insert into public.products (slug, name_mr, name_en, description_mr, description_en, price, category, tag, is_featured, sort_order) values
  ('besan-ladoo', 'बेसन लाडू', 'Besan Ladoo', 'मंद आचेवर खमंग भाजलेल्या बेसनाचे, साजुक तुपातले मऊ लाडू.', 'Gram flour slow-roasted till aromatic, rolled into soft ladoos with pure ghee.', 640, 'sweet', 'ghee', true, 10),
  ('balushahi', 'बालुशाही', 'Balushahi', 'बाहेरून कुरकुरीत, आतून पदरदार आणि पाकात मुरलेली बालुशाही.', 'Flaky, layered rounds fried in pure ghee and soaked in sugar syrup.', 660, 'sweet', 'ghee', false, 20),
  ('shankarpale-sweet', 'शंकरपाळे (गोड)', 'Shankarpale (Sweet)', 'साजुक तुपातले खुसखुशीत, हलक्या गोडीचे शंकरपाळे.', 'Crisp, lightly sweet diamond-cut bites made with pure ghee.', 640, 'sweet', 'ghee', true, 30),
  ('karanji', 'करंजी', 'Karanji', 'खोबरे-सुक्या मेव्याच्या सारणाने भरलेली, साजुक तुपात तळलेली करंजी.', 'Crisp half-moon pastries filled with coconut and dry fruits, fried in pure ghee.', 900, 'sweet', 'ghee', true, 40),
  ('bhajani-chakli', 'भाजणी चकली', 'Bhajani Chakli', 'घरच्या भाजणी पिठाची, खमंग आणि कुरकुरीत पारंपरिक चकली.', 'Traditional crunchy spirals made from our home-roasted bhajani flour.', 540, 'namkeen', null, true, 50),
  ('sev', 'शेव', 'Sev', 'बेसनाची बारीक, कुरकुरीत आणि हलकी शेव.', 'Fine, crunchy gram-flour noodles — light and moreish.', 400, 'namkeen', null, false, 60),
  ('lasun-sev', 'लसूण शेव', 'Garlic Sev', 'लसणाच्या चवीची, चटपटीत कुरकुरीत शेव.', 'Crunchy sev with a bold garlic kick.', 440, 'namkeen', null, false, 70),
  ('poha-chivda-fried', 'पोहा चिवडा (तळलेला)', 'Poha Chivda (Fried)', 'तळलेले पोहे, शेंगदाणे आणि खमंग फोडणीचा चिवडा.', 'Fried flattened rice tossed with peanuts and a fragrant tempering.', 400, 'namkeen', null, true, 80),
  ('patal-poha-chivda', 'पातळ पोहा चिवडा', 'Thin Poha Chivda', 'पातळ पोह्यांचा हलका, कुरकुरीत आणि चटपटीत चिवडा.', 'Light, crisp chivda made from thin flattened rice.', 360, 'namkeen', null, false, 90),
  ('shankarpale-salted', 'शंकरपाळे (खारे)', 'Shankarpale (Salted)', 'चहासोबत खाण्यासाठी खुसखुशीत खारे शंकरपाळे.', 'Crisp savoury shankarpale — perfect with evening tea.', 400, 'namkeen', null, false, 100),
  ('sapit-ladoo', 'सपीट लाडू', 'Sapit Ladoo', 'रव्याचे, साजुक तुपातले रवाळ आणि सुगंधी लाडू.', 'Fragrant semolina ladoos made with pure ghee.', 700, 'sweet', 'ghee', true, 110),
  ('anarse-pith', 'अनारसे पीठ', 'Anarse Flour', 'घरी अनारसे करण्यासाठी तयार पीठ.', 'Ready-made dough to make anarse at home.', 300, 'flour', null, false, 120),
  ('chakli-bhajani-pith', 'चकली भाजणी पीठ', 'Chakli Bhajani Flour', 'धान्ये-डाळी भाजून दळलेले, घरी चकली करण्यासाठी भाजणी पीठ.', 'Roasted grain-and-lentil flour to make chakli at home.', 300, 'flour', null, false, 130)
on conflict (slug) do nothing;

-- ---------- Admins ----------
-- 1) Create the login in Dashboard → Authentication → Users → "Add user" (tick "Auto confirm").
-- 2) Put the same email below (lowercase) and run just this line:
-- insert into public.admin_emails (email) values ('owner@example.com') on conflict do nothing;
