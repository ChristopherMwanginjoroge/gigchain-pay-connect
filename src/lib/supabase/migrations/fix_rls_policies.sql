-- RLS hardening + idempotent policy setup
-- Run this in Supabase SQL Editor after schema.sql and add_hedera_wallet_fields.sql

-- ============================================
-- TABLE RLS
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role manage profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role manage profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- KYC policies
DROP POLICY IF EXISTS "Users can view own KYC records" ON public.kyc;
DROP POLICY IF EXISTS "Users can insert own KYC records" ON public.kyc;
DROP POLICY IF EXISTS "Users can update rejected KYC records" ON public.kyc;
DROP POLICY IF EXISTS "Service role manage kyc" ON public.kyc;

CREATE POLICY "Users can view own KYC records"
  ON public.kyc FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC records"
  ON public.kyc FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update rejected KYC records"
  ON public.kyc FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'rejected')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manage kyc"
  ON public.kyc FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Service role manage transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manage transactions"
  ON public.transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STORAGE RLS
-- ============================================
DO $$
DECLARE
  objects_owner text;
BEGIN
  SELECT pg_get_userbyid(c.relowner)
    INTO objects_owner
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'storage'
    AND c.relname = 'objects';

  IF objects_owner IS NULL THEN
    RAISE NOTICE 'Skipping storage.objects policies: table not found.';
    RETURN;
  END IF;

  IF current_user <> objects_owner AND NOT pg_has_role(current_user, objects_owner, 'MEMBER') THEN
    RAISE NOTICE 'Skipping storage.objects policies: current user % is not owner/member of owner role %.', current_user, objects_owner;
    RETURN;
  END IF;

  EXECUTE 'DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can upload own selfies" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can view own selfies" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete own selfies" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Service role manage storage objects" ON storage.objects';

  EXECUTE 'CREATE POLICY "Users can upload own documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = ''kyc-documents''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Users can view own documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = ''kyc-documents''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Users can delete own documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = ''kyc-documents''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Users can upload own selfies"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = ''kyc-selfies''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Users can view own selfies"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = ''kyc-selfies''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Users can delete own selfies"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = ''kyc-selfies''
      AND auth.uid()::text = (storage.foldername(name))[1]
    )';

  EXECUTE 'CREATE POLICY "Service role manage storage objects"
    ON storage.objects FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true)';
END $$;

-- ============================================
-- ROBUST NEW USER PROFILE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NEW.phone, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
