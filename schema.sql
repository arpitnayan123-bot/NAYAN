-- ============================================
-- AAROGYA AI — SUPABASE SCHEMA v1.0
-- Healthcare data model with Row-Level Security
-- PostgreSQL 15+ required
-- ============================================

-- Enable extensions
create extension if not exists "pgcrypto";
create extension if not exists "vector";  -- for AI embeddings later

-- ============================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_group text,
  emergency_contact text,
  emergency_phone text,
  city text,
  state text,
  pincode text,
  language_preference text default 'english',
  marketing_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- HEALTH METRICS (daily vitals, timestamped)
-- ============================================
create table public.health_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recorded_at timestamptz default now(),
  
  -- Core vitals
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  systolic_bp integer,
  diastolic_bp integer,
  heart_rate integer,
  blood_oxygen numeric(4,1),
  
  -- Lifestyle
  steps integer,
  water_ml integer,
  calories_consumed integer,
  calories_target integer,
  sleep_hours numeric(3,1),
  sleep_quality integer check (sleep_quality between 1 and 5),
  
  -- Mood & wellness
  mood text,
  stress_level integer check (stress_level between 1 and 5),
  energy_level integer check (energy_level between 1 and 5),
  
  -- Notes
  notes text,
  source text check (source in ('manual', 'wearable', 'api', 'ai_inferred')),
  
  created_at timestamptz default now()
);

create index idx_metrics_user_date on public.health_metrics(user_id, recorded_at desc);
create index idx_metrics_date on public.health_metrics(recorded_at desc);

-- ============================================
-- SYMPTOM SESSIONS & MESSAGES (chat history)
-- ============================================
create table public.symptom_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  summary text,
  ai_model text default 'llama-3.3-70b',
  language text default 'english',
  status text check (status in ('active', 'completed', 'escalated')) default 'active',
  risk_level text check (risk_level in ('low', 'moderate', 'high', 'urgent')),
  suggested_specialty text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.symptom_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.symptom_sessions(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  metadata jsonb,  -- extracted entities, confidence scores
  created_at timestamptz default now()
);

create index idx_sessions_user on public.symptom_sessions(user_id, created_at desc);
create index idx_messages_session on public.symptom_messages(session_id, created_at);

-- ============================================
-- LAB REPORTS (raw + AI-parsed)
-- ============================================
create table public.lab_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Source
  source text check (source in ('text_paste', 'image_upload', 'pdf_upload', 'api_import')),
  source_text text,  -- raw pasted text
  source_file_url text,  -- if uploaded file
  
  -- AI Analysis
  parsed_biomarkers jsonb,  -- [{name, value, unit, status, reference_range}]
  overall_status text,  -- normal / needs_attention / critical
  ai_summary_en text,  -- English summary
  ai_summary_hi text,  -- Hindi summary
  recommendations jsonb,  -- {diet, exercise, monitoring, doctor}
  risk_factors jsonb,
  ai_model text,
  confidence numeric(3,2),
  
  -- Metadata
  lab_name text,
  report_date date,
  patient_age integer,
  patient_gender text,
  
  -- Human review
  reviewed_by_doctor boolean default false,
  doctor_notes text,
  
  created_at timestamptz default now()
);

create index idx_reports_user on public.lab_reports(user_id, created_at desc);

-- ============================================
-- APPOINTMENTS (doctor bookings)
-- ============================================
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Doctor info
  doctor_name text not null,
  doctor_specialty text not null,
  doctor_id text,  -- external system ID
  doctor_image_url text,
  
  -- Appointment details
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes integer default 30,
  consultation_type text check (consultation_type in ('video', 'audio', 'in_person', 'chat')) default 'video',
  
  -- Status
  status text check (status in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) default 'scheduled',
  room_url text,
  
  -- Notes
  reason_for_visit text,
  symptoms_summary text,
  prescription text,
  follow_up_notes text,
  
  -- Payment
  fee_inr integer,
  payment_status text check (payment_status in ('pending', 'paid', 'refunded')) default 'pending',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_appointments_user on public.appointments(user_id, appointment_date desc);

-- ============================================
-- AI HEALTH PROFILES (generated by backend)
-- ============================================
create table public.health_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Generation metadata
  generated_at timestamptz default now(),
  based_on_report_ids uuid[],  -- which reports were used
  ai_model text,
  
  -- Profile data
  health_score integer check (health_score between 0 and 100),
  overall_status text,
  summary_en text,
  summary_hi text,
  
  -- Detailed sections
  biomarkers_analysis jsonb,
  key_risks jsonb,  -- [{condition, severity, probability, reasoning}]
  patterns jsonb,  -- AI-detected patterns
  recommendations jsonb,  -- {doctors, diet, exercise, monitoring, medications}
  prevention_plans jsonb,
  predictions jsonb,  -- 6m/12m/24m projections
  
  -- Validity
  valid_until timestamptz,  -- profiles expire after 90 days
  is_current boolean default true
);

create index idx_profiles_user on public.health_profiles(user_id, generated_at desc);

-- ============================================
-- MOOD LOGS
-- ============================================
create table public.mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  logged_at timestamptz default now(),
  mood text not null,
  note text,
  tags text[],
  created_at timestamptz default now()
);

create index idx_mood_user on public.mood_logs(user_id, logged_at desc);

-- ============================================
-- DIET PLANS
-- ============================================
create table public.diet_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  goal text,
  diet_preference text,
  daily_calories integer,
  protein_g numeric(5,1),
  carbs_g numeric(5,1),
  fat_g numeric(5,1),
  
  meals jsonb,  -- {monday: {breakfast, lunch, snack, dinner}, ...}
  shopping_list text[],
  general_advice text[],
  
  created_at timestamptz default now()
);

-- ============================================
-- X-RAY ANALYSES
-- ============================================
create table public.xray_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  image_url text not null,
  scan_type text,  -- chest, bone, spine, skull
  
  -- AI findings
  findings jsonb,  -- [{region, observation, severity, confidence}]
  summary_en text,
  summary_hi text,
  recommended_actions text[],
  ai_model text,
  confidence numeric(3,2),
  
  -- Clinical review
  reviewed_by text,
  clinical_notes text,
  
  created_at timestamptz default now()
);

-- ============================================
-- USAGE & ANALYTICS (for rate limiting & billing)
-- ============================================
create table public.api_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null,
  model text,
  tokens_used integer,
  latency_ms integer,
  success boolean default true,
  created_at timestamptz default now()
);

create index idx_usage_user on public.api_usage(user_id, created_at desc);
create index idx_usage_endpoint on public.api_usage(endpoint, created_at desc);

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- Every table: users can only access their own data
-- ============================================

alter table public.profiles enable row level security;
alter table public.health_metrics enable row level security;
alter table public.symptom_sessions enable row level security;
alter table public.symptom_messages enable row level security;
alter table public.lab_reports enable row level security;
alter table public.appointments enable row level security;
alter table public.health_profiles enable row level security;
alter table public.mood_logs enable row level security;
alter table public.diet_plans enable row level security;
alter table public.xray_analyses enable row level security;
alter table public.api_usage enable row level security;

-- Profiles: user can read own, update own
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Metrics
create policy "Users manage own metrics" on public.health_metrics
  for all using (auth.uid() = user_id);

-- Symptom sessions & messages
create policy "Users manage own sessions" on public.symptom_sessions
  for all using (auth.uid() = user_id);
create policy "Users manage own messages" on public.symptom_messages
  for all using (
    exists (
      select 1 from public.symptom_sessions
      where id = symptom_messages.session_id and user_id = auth.uid()
    )
  );

-- Lab reports
create policy "Users manage own reports" on public.lab_reports
  for all using (auth.uid() = user_id);

-- Appointments
create policy "Users manage own appointments" on public.appointments
  for all using (auth.uid() = user_id);

-- Health profiles
create policy "Users read own profiles" on public.health_profiles
  for select using (auth.uid() = user_id);

-- Mood logs
create policy "Users manage own mood" on public.mood_logs
  for all using (auth.uid() = user_id);

-- Diet plans
create policy "Users manage own diet" on public.diet_plans
  for all using (auth.uid() = user_id);

-- X-ray
create policy "Users manage own xrays" on public.xray_analyses
  for all using (auth.uid() = user_id);

-- API usage (read-only for user)
create policy "Users read own usage" on public.api_usage
  for select using (auth.uid() = user_id);

-- ============================================
-- PERFORMANCE: Enable compression & indexing
-- ============================================
alter table public.lab_reports alter column parsed_biomarkers set storage extended;
alter table public.health_profiles alter column recommendations set storage extended;

-- ============================================
-- SEED DATA (for development)
-- ============================================
-- Insert test doctors if needed (can be expanded)
create table public.doctors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  experience_years integer,
  rating numeric(2,1),
  reviews_count integer,
  fee_inr integer,
  image_url text,
  bio text,
  languages text[],
  available boolean default true,
  created_at timestamptz default now()
);

alter table public.doctors enable row level security;
create policy "Doctors are publicly readable" on public.doctors
  for select using (true);

-- ============================================
-- FUNCTIONS: Health score calculation
-- ============================================
create or replace function public.calculate_health_score(user_id_param uuid)
returns integer as $$
declare
  latest_metrics record;
  score integer := 50;
begin
  select * into latest_metrics
  from public.health_metrics
  where user_id = user_id_param
  order by recorded_at desc
  limit 1;
  
  if latest_metrics is null then
    return score;
  end if;
  
  -- Sleep (10 pts)
  if latest_metrics.sleep_hours between 7 and 9 then score := score + 10;
  elsif latest_metrics.sleep_hours >= 6 then score := score + 5;
  end if;
  
  -- Hydration (15 pts)
  if latest_metrics.water_ml is not null and latest_metrics.water_ml > 2000 then
    score := score + 15;
  end if;
  
  -- Steps (15 pts)
  if latest_metrics.steps is not null and latest_metrics.steps >= 8000 then
    score := score + 15;
  elsif latest_metrics.steps is not null and latest_metrics.steps >= 4000 then
    score := score + 8;
  end if;
  
  -- BP (10 pts)
  if latest_metrics.systolic_bp between 110 and 125
     and latest_metrics.diastolic_bp between 70 and 85 then
    score := score + 10;
  else
    score := score + 5;
  end if;
  
  return least(100, score);
end;
$$ language plpgsql security definer;

-- ============================================
-- DONE
-- ============================================
-- Run: supabase db push
-- Or paste into Supabase SQL Editor
