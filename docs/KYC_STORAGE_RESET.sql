-- ============================================
-- KYC STORAGE BUCKETS - FRESH SETUP
-- ============================================
-- This script creates KYC storage buckets and RLS policies from scratch
-- Run this in Supabase SQL Editor after deleting old buckets

-- STEP 1: Drop any existing RLS policies (cleanup)
-- ============================================

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Service role manage storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;

-- STEP 2: Create fresh storage buckets
-- ============================================

-- Create kyc-documents bucket (for ID documents, passports, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-documents',
    'kyc-documents',
    false, -- Private, not publicly accessible
    5242880, -- 5MB in bytes (5 * 1024 * 1024)
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
);

-- Create kyc-selfies bucket (for selfie photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-selfies',
    'kyc-selfies',
    false, -- Private, not publicly accessible
    2097152, -- 2MB in bytes (2 * 1024 * 1024)
    ARRAY['image/jpeg', 'image/png', 'image/jpg']
);

-- STEP 3: Enable RLS on storage.objects
-- ============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create RLS policies for kyc-documents bucket
-- ============================================

-- Policy 1: Allow authenticated users to INSERT (upload) to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow authenticated users to SELECT (view/download) their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow authenticated users to DELETE their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow authenticated users to UPDATE their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- STEP 5: Create RLS policies for kyc-selfies bucket
-- ============================================

-- Policy 1: Allow authenticated users to INSERT (upload) to their own folder
CREATE POLICY "Users can upload own selfies"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'kyc-selfies' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Allow authenticated users to SELECT (view/download) their own selfies
CREATE POLICY "Users can view own selfies"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'kyc-selfies' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow authenticated users to DELETE their own selfies
CREATE POLICY "Users can delete own selfies"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'kyc-selfies' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow authenticated users to UPDATE their own selfies
CREATE POLICY "Users can update own selfies"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'kyc-selfies' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'kyc-selfies' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly

-- 1. Check if buckets exist
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('kyc-documents', 'kyc-selfies');

-- 2. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND (policyname LIKE '%documents%' OR policyname LIKE '%selfies%')
ORDER BY policyname;

-- 3. Count existing files (should be 0 after reset)
SELECT bucket_id, COUNT(*) as file_count
FROM storage.objects
WHERE bucket_id IN ('kyc-documents', 'kyc-selfies')
GROUP BY bucket_id;
