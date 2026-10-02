-- ====================================================================
-- LABAL PLATFORM — SÉCURITÉ, RBAC & GESTION DES RÔLES ET AUDIT LOGS
-- ====================================================================

-- 1. Types ENUM pour les rôles et statuts de sécurité
CREATE TYPE user_role AS ENUM ('ADMIN', 'ENQUETEUR');
CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- 2. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  commune_affectation VARCHAR(100) DEFAULT 'Kaloum',
  role user_role DEFAULT 'ENQUETEUR',
  status user_status DEFAULT 'PENDING',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des logs d'audit (Audit Logging OWASP Top 10)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_name VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'USER_APPROVED', 'USER_REJECTED', 'ROLE_CHANGED'
  target_id UUID REFERENCES public.profiles(id),
  target_name VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activation de la sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Politiques de Sécurité RLS

-- A. Les administrateurs peuvent tout voir et modifier sur les profils
CREATE POLICY admin_manage_profiles ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN' AND p.status = 'APPROVED'
    )
  );

-- B. Les enquêteurs ne peuvent lire que leur propre profil
CREATE POLICY self_read_profile ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- C. Les utilisateurs anonymes / nouveaux inscrits peuvent créer leur profil en attente
CREATE POLICY anon_register_profile ON public.profiles
  FOR INSERT
  WITH CHECK (status = 'PENDING');

-- 6. SEED : 3 COMPTES ADMINISTRATEURS RACINE PRÉ-VALIDÉS
INSERT INTO public.profiles (id, email, full_name, phone, commune_affectation, role, status, approved_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin1@labal-guinee.org', 'Marseille Camara', '+224 621 00 11 22', 'Toutes (Conakry)', 'ADMIN', 'APPROVED', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'admin2@labal-guinee.org', 'Fatoumata Binta Sow', '+224 622 33 44 55', 'Toutes (Conakry)', 'ADMIN', 'APPROVED', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'admin3@labal-guinee.org', 'Thierno Mamadou Diallo', '+224 628 77 88 99', 'Toutes (Conakry)', 'ADMIN', 'APPROVED', NOW())
ON CONFLICT (email) DO UPDATE
SET role = 'ADMIN', status = 'APPROVED';

-- SEED ENQUÊTEURS DE DÉMO
INSERT INTO public.profiles (id, email, full_name, phone, commune_affectation, role, status, approved_by, approved_at)
VALUES 
  ('00000000-0000-0000-0000-000000000010', 'amara.diallo@labal-guinee.org', 'Amara Diallo', '+224 620 11 22 33', 'Ratoma', 'ENQUETEUR', 'APPROVED', '00000000-0000-0000-0000-000000000001', NOW()),
  ('00000000-0000-0000-0000-000000000011', 'fanta.conde@labal-guinee.org', 'Fanta Condé', '+224 624 44 55 66', 'Kaloum', 'ENQUETEUR', 'PENDING', NULL, NULL),
  ('00000000-0000-0000-0000-000000000012', 'sekou.toure@labal-guinee.org', 'Sékou Touré', '+224 626 99 88 77', 'Matoto', 'ENQUETEUR', 'PENDING', NULL, NULL)
ON CONFLICT (email) DO NOTHING;
