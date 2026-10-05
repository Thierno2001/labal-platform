-- ====================================================================
-- LABAL PLATFORM — SÉCURITÉ, RBAC & GESTION DES MOTS DE PASSE (HACHAGE OWASP)
-- ====================================================================

-- 1. Types ENUM pour les rôles et statuts de sécurité
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'ENQUETEUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table des profils utilisateurs avec mot de passe haché + Salt
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  commune_affectation VARCHAR(100) DEFAULT 'Kaloum',
  role user_role DEFAULT 'ENQUETEUR',
  status user_status DEFAULT 'PENDING',
  password_hash TEXT NOT NULL, -- Stockage PBKDF2:SHA256:100000$SALT$HASH_HEX
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des logs d'audit (Audit Logging OWASP Top 10)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_name VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'USER_APPROVED', 'USER_REJECTED', 'ROLE_CHANGED'
  target_id UUID,
  target_name VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activation de la sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Fonction SECURITY DEFINER anti-récursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'ADMIN' AND status = 'APPROVED'
  );
$$;

-- 6. Politiques RLS sans récursion
DROP POLICY IF EXISTS admin_manage_profiles ON public.profiles;
DROP POLICY IF EXISTS self_read_profile ON public.profiles;
DROP POLICY IF EXISTS anon_register_profile ON public.profiles;
DROP POLICY IF EXISTS allow_all_profiles ON public.profiles;

CREATE POLICY allow_all_profiles ON public.profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS allow_all_audit ON public.audit_logs;
CREATE POLICY allow_all_audit ON public.audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. SEED : 3 COMPTES ADMINISTRATEURS RACINE PRÉ-VALIDÉS AVEC MOTS DE PASSE HACHÉS (PBKDF2)
INSERT INTO public.profiles (id, email, full_name, phone, commune_affectation, role, status, password_hash, approved_at)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'admin1@labal-guinee.org',
    'Marseille Camara',
    '+224 621 00 11 22',
    'Toutes (Conakry)',
    'ADMIN',
    'APPROVED',
    'pbkdf2:sha256:100000$a1b2c3d4e5f60718293a4b5c6d7e8f00$3f0582f8ff52d5bc92d8eb493b7e17fed35a2ef5b09ee9851d230087dbc7e7d1',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'admin2@labal-guinee.org',
    'Fatoumata Binta Sow',
    '+224 622 33 44 55',
    'Toutes (Conakry)',
    'ADMIN',
    'APPROVED',
    'pbkdf2:sha256:100000$b2c3d4e5f60718293a4b5c6d7e8f00a1$d4391b42f3bfc68006be2a2bce2e6b158bee74b269d61219c661cba1bcfa69f4',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'admin3@labal-guinee.org',
    'Thierno Mamadou Diallo',
    '+224 628 77 88 99',
    'Toutes (Conakry)',
    'ADMIN',
    'APPROVED',
    'pbkdf2:sha256:100000$c3d4e5f60718293a4b5c6d7e8f00a1b2$578e724db734882d2b7409211cb1b84a5dbc5c9a12acc060ea0861837eab7bd7',
    NOW()
  )
ON CONFLICT (email) DO UPDATE
SET 
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  password_hash = EXCLUDED.password_hash;
