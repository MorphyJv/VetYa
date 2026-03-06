-- =====================================================
-- VetYa — Full Database Schema (Supabase / PostgreSQL)
-- Run this in the Supabase SQL Editor
-- =====================================================

-- ── 1. profiles ──
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'vet')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ── 2. pets ──
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'reptile', 'other')),
  breed VARCHAR(100),
  weight_kg DECIMAL(5,2),
  birth_date DATE,
  sex VARCHAR(10) CHECK (sex IN ('male', 'female')),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own pets"
  ON public.pets FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- ── 3. medical_records ──
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES public.profiles(id),
  visit_date DATE NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  observations TEXT,
  record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('routine', 'emergency', 'followup')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read own pet records"
  ON public.medical_records FOR SELECT TO authenticated
  USING (pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));

CREATE POLICY "Owners and vets insert records"
  ON public.medical_records FOR INSERT TO authenticated
  WITH CHECK (
    pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid())
    OR vet_id = auth.uid()
  );

CREATE POLICY "Owners update own pet records"
  ON public.medical_records FOR UPDATE TO authenticated
  USING (pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));

CREATE POLICY "Owners delete own pet records"
  ON public.medical_records FOR DELETE TO authenticated
  USING (pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));

-- ── 4. vaccinations ──
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(150) NOT NULL,
  applied_date DATE NOT NULL,
  next_due_date DATE,
  lot_number VARCHAR(50),
  applied_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own pet vaccinations"
  ON public.vaccinations FOR ALL TO authenticated
  USING (pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));

-- ── 5. calendar_events ──
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_datetime TIMESTAMPTZ NOT NULL,
  event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('vaccine', 'deworming', 'checkup', 'medication', 'other')),
  notified BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own events"
  ON public.calendar_events FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- ── 6. vet_profiles ──
CREATE TABLE public.vet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  specialty VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  clinic_name VARCHAR(200),
  clinic_address TEXT,
  clinic_phone VARCHAR(20),
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vet_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vet profiles are viewable by all authenticated"
  ON public.vet_profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Vets manage own profile"
  ON public.vet_profiles FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 7. emergency_requests ──
CREATE TABLE public.emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  assigned_vet_id UUID REFERENCES public.profiles(id),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'MODERATE', 'MILD')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED')),
  description TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners see own emergencies"
  ON public.emergency_requests FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Vets see pending and assigned emergencies"
  ON public.emergency_requests FOR SELECT TO authenticated
  USING (status = 'PENDING' OR assigned_vet_id = auth.uid());

CREATE POLICY "Owners create emergencies"
  ON public.emergency_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Participants update emergency"
  ON public.emergency_requests FOR UPDATE TO authenticated
  USING (auth.uid() = assigned_vet_id OR auth.uid() = owner_id);

-- ── 8. emergency_messages ──
CREATE TABLE public.emergency_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants access emergency messages"
  ON public.emergency_messages FOR ALL TO authenticated
  USING (
    emergency_id IN (
      SELECT id FROM public.emergency_requests
      WHERE owner_id = auth.uid() OR assigned_vet_id = auth.uid()
    )
  );

-- ── 9. ai_conversations ──
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  title VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own AI conversations"
  ON public.ai_conversations FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- ── 10. ai_messages ──
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(15) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  triggered_guardrail BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own AI messages"
  ON public.ai_messages FOR ALL TO authenticated
  USING (
    conversation_id IN (SELECT id FROM public.ai_conversations WHERE owner_id = auth.uid())
  );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_pets_owner ON public.pets(owner_id);
CREATE INDEX idx_medical_records_pet ON public.medical_records(pet_id, visit_date DESC);
CREATE INDEX idx_vaccinations_pet ON public.vaccinations(pet_id, applied_date DESC);
CREATE INDEX idx_calendar_upcoming ON public.calendar_events(event_datetime, notified)
  WHERE notified = FALSE AND completed = FALSE;
CREATE INDEX idx_emergency_active ON public.emergency_requests(status, created_at DESC)
  WHERE status IN ('PENDING', 'IN_PROGRESS');
CREATE INDEX idx_emergency_msgs ON public.emergency_messages(emergency_id, sent_at ASC);
CREATE INDEX idx_ai_convos_owner ON public.ai_conversations(owner_id, created_at DESC);
CREATE INDEX idx_ai_msgs_convo ON public.ai_messages(conversation_id, created_at ASC);

-- =====================================================
-- TRIGGER: Auto-create profile on signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_pets
  BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_calendar
  BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_vet_profiles
  BEFORE UPDATE ON public.vet_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_emergency
  BEFORE UPDATE ON public.emergency_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_ai_convos
  BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Enable Realtime for emergency messages
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_messages;
