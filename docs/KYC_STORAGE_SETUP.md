# KYC Storage Bucket Setup & Troubleshooting

**Issue:** Users cannot upload KYC documents to Supabase storage buckets.

**Last Updated:** March 10, 2026

---

## � Quick Reset (If Buckets Already Exist)

**If your storage buckets already exist but aren't working:**

1. Open Supabase SQL Editor
2. Run the complete reset script: `docs/KYC_STORAGE_RESET.sql`
3. This will:
   - ✅ Drop all existing RLS policies
   - ✅ Delete all files from buckets
   - ✅ Remove the buckets
   - ✅ Recreate buckets with proper configuration
   - ✅ Set up correct RLS policies

**⚠️ WARNING:** This deletes all existing KYC files. Backup first if needed!

---

## �🔍 Problem Diagnosis

The KYC upload feature requires two storage buckets in Supabase:
1. `kyc-documents` - For ID documents, passports, driver's licenses (max 5MB)
2. `kyc-selfies` - For selfie photos (max 2MB)

Both buckets need:
- ✅ To be created in Supabase Storage
- ✅ Proper RLS (Row Level Security) policies applied
- ✅ Correct file size limits and MIME type restrictions

---

## ✅ Step-by-Step Fix

### Step 1: Check if Buckets Exist

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Check if you see these buckets:
   - `kyc-documents`
   - `kyc-selfies`

**If you DON'T see these buckets, proceed to Step 2.**

---

### Step 2: Run the Storage Setup SQL

Go to your Supabase **SQL Editor** and run the following SQL script:

```sql
-- ============================================
-- KYC STORAGE BUCKETS SETUP
-- ============================================
-- This script creates the storage buckets and RLS policies
-- for KYC document uploads

-- 1. CREATE BUCKETS
-- ============================================

-- Create kyc-documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-documents',
    'kyc-documents',
    false, -- Not publicly accessible
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

-- Create kyc-selfies bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-selfies',
    'kyc-selfies',
    false, -- Not publicly accessible
    2097152, -- 2MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg'];

-- 2. ENABLE RLS ON STORAGE.OBJECTS
-- ============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Service role manage storage objects" ON storage.objects;

-- 4. CREATE RLS POLICIES FOR KYC-DOCUMENTS
-- ============================================

-- Allow users to upload documents to their own folder (user_id/filename)
CREATE POLICY "Users can upload own documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'kyc-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'kyc-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own documents (for resubmission)
CREATE POLICY "Users can delete own documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'kyc-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 5. CREATE RLS POLICIES FOR KYC-SELFIES
-- ============================================

-- Allow users to upload selfies to their own folder
CREATE POLICY "Users can upload own selfies"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'kyc-selfies' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view their own selfies
CREATE POLICY "Users can view own selfies"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'kyc-selfies' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own selfies
CREATE POLICY "Users can delete own selfies"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'kyc-selfies' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 6. SERVICE ROLE POLICY (Admin access)
-- ============================================

-- Allow service role to manage all storage objects
CREATE POLICY "Service role manage storage objects"
    ON storage.objects FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

### Step 3: Verify Bucket Creation

After running the SQL:

1. Go back to **Storage** in Supabase dashboard
2. Confirm you see both buckets:
   - ✅ `kyc-documents`
   - ✅ `kyc-selfies`
3. Click on each bucket to verify settings:
   - **Public:** Should be OFF (private)
   - **File size limit:** 5MB for documents, 2MB for selfies
   - **Allowed MIME types:** As specified above

---

### Step 4: Test Upload from App

1. Sign up or log in to your app
2. Navigate to `/app/kyc`
3. Select a document type
4. Choose a document file (< 5MB)
5. Choose a selfie file (< 2MB)
6. Click Submit

**Expected Result:** ✅ Upload should succeed and KYC record created

**If it fails:** Check browser console for errors and proceed to Step 5

---

## 🐛 Troubleshooting

### Error: "No active session"

**Cause:** User not authenticated or session expired

**Fix:**
1. Log out and log back in
2. Check that authentication is working
3. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

---

### Error: "new row violates row-level security policy"

**Cause:** RLS policies not applied or incorrect

**Fix:**
1. Re-run the SQL from Step 2
2. Make sure you're running it as the **postgres** user or database owner
3. Check that `auth.uid()` is returning the correct user ID

**Verification Query:**
```sql
-- Run this while logged in to check your user ID
SELECT auth.uid();

-- Should return your UUID, not NULL
```

---

### Error: "Bucket not found" or "bucket_id does not exist"

**Cause:** Buckets not created

**Fix:**
1. Manually create buckets in Supabase Storage UI:
   - Click **New bucket**
   - Name: `kyc-documents`
   - Public: OFF
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: image/jpeg, image/png, image/jpg, application/pdf
2. Repeat for `kyc-selfies` with 2MB limit
3. Then re-run the RLS policies SQL from Step 2

---

### Error: "File size exceeds limit"

**Cause:** File too large or bucket limit too small

**Fix:**
1. Ensure document files are < 5MB
2. Ensure selfie files are < 2MB
3. Compress images if needed
4. Update bucket limits if needed:

```sql
UPDATE storage.buckets 
SET file_size_limit = 5242880 
WHERE id = 'kyc-documents';

UPDATE storage.buckets 
SET file_size_limit = 2097152 
WHERE id = 'kyc-selfies';
```

---

### Error: "MIME type not allowed"

**Cause:** File type not in allowed list

**Fix:**
1. Ensure you're uploading:
   - **Documents:** JPG, PNG, or PDF only
   - **Selfies:** JPG or PNG only
2. Update allowed MIME types if needed:

```sql
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
WHERE id = 'kyc-documents';

UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg']
WHERE id = 'kyc-selfies';
```

---

### Error: "Path does not match user ID"

**Cause:** File path doesn't start with user's UUID

**Fix:**
This should be handled automatically by the code in `src/lib/kyc.ts`. 

Verify the path format:
- Correct: `{user_uuid}/{timestamp}-filename.jpg`
- Incorrect: `filename.jpg` or `other-uuid/filename.jpg`

Check the code in `src/lib/kyc.ts`:
```typescript
// Should generate path like: "abc123-uuid/1234567890-document.pdf"
const documentPath = buildStoragePath(userId, payload.documentFile.name, now);
```

---

## 🔐 Security Notes

### RLS Policy Explanation

The RLS policies ensure:

1. **Isolation:** Users can only access their own files
2. **Path-based security:** Files must be in folders named with the user's UUID
3. **Bucket separation:** Documents and selfies are in separate buckets
4. **Private storage:** Buckets are NOT public (requires authentication)

### Path Format

Files are stored using this format:
```
kyc-documents/{user_uuid}/{timestamp}-{sanitized_filename}
kyc-selfies/{user_uuid}/{timestamp}-{sanitized_filename}
```

Example:
```
kyc-documents/123e4567-e89b-12d3-a456-426614174000/1709856000000-passport.pdf
kyc-selfies/123e4567-e89b-12d3-a456-426614174000/1709856001000-selfie.jpg
```

This ensures:
- ✅ No file name collisions
- ✅ User isolation via RLS
- ✅ Chronological ordering
- ✅ Safe filenames (sanitized)

---

## 📊 Verify Everything Works

Run this SQL to check your setup:

```sql
-- 1. Check if buckets exist
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('kyc-documents', 'kyc-selfies');

-- Expected: 2 rows returned

-- 2. Check RLS policies on storage.objects
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%kyc%';

-- Expected: 6 policies (3 for documents + 3 for selfies)

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Expected: rowsecurity = true

-- 4. Test current user can upload (while authenticated)
SELECT 
    auth.uid() AS my_user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'Authenticated ✅'
        ELSE 'Not authenticated ❌'
    END AS auth_status;
```

---

## 🎯 Quick Fix Checklist

Use this checklist to ensure everything is set up:

- [ ] `kyc-documents` bucket created
- [ ] `kyc-selfies` bucket created
- [ ] Both buckets set to **private** (not public)
- [ ] File size limits set (5MB and 2MB)
- [ ] MIME types configured
- [ ] RLS enabled on `storage.objects`
- [ ] 6 RLS policies created (3 per bucket)
- [ ] Service role policy created
- [ ] Test upload works in app
- [ ] Files appear in correct folder structure

---

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check browser console** for detailed error messages
2. **Check Supabase logs** in the Dashboard → Logs section
3. **Verify environment variables** in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Test with Supabase client directly** using SQL queries
5. **Check user authentication** - user must be logged in

---

## 🔗 Related Files

- `src/lib/kyc.ts` - KYC validation and path building
- `src/lib/api/kyc.ts` - KYC upload mutations
- `src/lib/supabase/rest.ts` - Storage upload helper
- `src/pages/app/Kyc.tsx` - KYC upload UI
- `src/lib/supabase/migrations/schema.sql` - Database schema with storage setup
- `src/lib/supabase/migrations/fix_rls_policies.sql` - RLS policy updates

---

**Last Updated:** March 10, 2026  
**Status:** Production-Ready
