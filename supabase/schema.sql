-- WhatsFlow CRM Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE (extends Supabase Auth users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  whatsapp_number text,
  created_at timestamptz default now()
);

-- ============================================
-- LEADS TABLE
-- ============================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  phone_number text not null,
  name text,
  first_message text,
  status text default 'New Lead',
  is_group boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_status check (status in ('New Lead', 'Contacted', 'Closed')),
  unique(user_id, phone_number)
);

-- Messages table for chat history
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    lead_id uuid references public.leads(id) on delete cascade not null,
    sender_type text not null check (sender_type in ('lead', 'agent')),
    content text not null,
    created_at timestamptz default now()
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null default 'starter',
  created_at timestamptz default now(),
  constraint valid_tier check (tier in ('starter', 'growth', 'scale'))
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Leads policies
create policy "Users can view their own leads"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "Users can insert their own leads"
  on public.leads for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own leads"
  on public.leads for update
  using (auth.uid() = user_id);

create policy "Users can delete their own leads"
  on public.leads for delete
  using (auth.uid() = user_id);

-- Policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their leads" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = messages.lead_id
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages for their leads" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = messages.lead_id
            AND leads.user_id = auth.uid()
        )
    );

-- Service role can insert leads (for webhook)
create policy "Service role can manage all leads"
  on public.leads for all
  using (auth.role() = 'service_role');

-- Subscriptions policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================
create index if not exists leads_user_id_idx on public.leads(user_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_phone_idx on public.leads(phone_number);

-- ============================================
-- SAMPLE DATA (optional)
-- ============================================
-- Uncomment to add demo data after inserting a real user:
-- insert into public.leads (user_id, phone_number, first_message, status)
-- values 
--   ('<your-user-id>', '+60123456789', 'Saya berminat dengan kereta Proton X50', 'New Lead'),
--   ('<your-user-id>', '+60198765432', 'Ada rumah untuk dijual di Subang?', 'Contacted'),
--   ('<your-user-id>', '+60112345678', 'Harga berapa untuk servis aircond?', 'Closed');
