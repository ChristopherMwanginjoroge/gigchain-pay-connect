# KYC Upload Debugging Guide

## Potential Issues Found

### Issue #1: Storage Upload Content-Type Header
**File:** `src/lib/supabase/rest.ts` (line 66-80)

The current implementation sets `Content-Type` to the file's MIME type:
```typescript
headers: {
  "Content-Type": file.type || "application/octet-stream",
}
```

**Problem:** Supabase Storage API expects files to be uploaded with proper multipart/form-data or without explicit Content-Type header for binary uploads.

### Issue #2: Missing Error Details
When uploads fail, we're not capturing the full error response from Supabase.

---

## 🔍 How to Debug

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try uploading a KYC document
4. Look for errors like:
   - `403 Forbidden` → RLS policy issue
   - `400 Bad Request` → Path or file format issue
   - `401 Unauthorized` → Token issue
   - `413 Payload Too Large` → File size exceeds bucket limit

### Step 2: Check Network Tab
1. Open DevTools → **Network** tab
2. Filter by "storage"
3. Try upload again
4. Click on the failed request
5. Check:
   - **Request URL**: Should be `/storage/v1/object/kyc-documents/{userId}/{timestamp}-{filename}`
   - **Request Headers**: Look for Authorization token
   - **Response**: Read the error message

### Step 3: Verify RLS Policies in Supabase
1. Go to Supabase Dashboard → Storage → kyc-documents
2. Click "Policies" tab
3. Verify you see these policies:
   - ✅ Users can upload own documents (INSERT)
   - ✅ Users can view own documents (SELECT)
   - ✅ Users can delete own documents (DELETE)
   - ✅ Users can update own documents (UPDATE)

### Step 4: Test Manual Upload
1. Go to Supabase Dashboard → Storage
2. Click "kyc-documents" bucket
3. Try manually uploading a file with path: `{your-user-id}/test.jpg`
4. If this fails → RLS policy is wrong
5. If this works → Code issue

---

## 🔧 Common Errors & Fixes

### Error: "new row violates row-level security policy"
**Cause:** Path doesn't match userId or RLS policy is misconfigured

**Fix:** 
- Path MUST be: `{uuid}/{timestamp}-{filename}`
- First folder name must match `auth.uid()`
- Check policy: `auth.uid()::text = (storage.foldername(name))[1]`

### Error: "Failed to create resource"
**Cause:** Content-Type header issue or file corruption

**Fix:**
- Remove Content-Type header OR
- Use FormData instead of direct file upload

### Error: "Payload too large"
**Cause:** File exceeds bucket limits

**Fix:**
- kyc-documents: Max 5MB
- kyc-selfies: Max 2MB
- Check file size before upload in code

### Error: "Invalid token" or "Unauthorized"
**Cause:** User not authenticated or token expired

**Fix:**
- Verify user is logged in
- Check token is being passed in Authorization header
- Try logging out and back in

---

## 🚀 Recommended Code Fix

### Option 1: Use Supabase Client SDK (Recommended)

Replace the `storageUpload` function in `src/lib/supabase/rest.ts`:

```typescript
export async function storageUpload(bucket: string, filePath: string, file: File): Promise<void> {
  const token = await supabaseClient.getAccessToken();
  if (!token) {
    throw new SupabaseRestError("No active session", 401);
  }

  // Use FormData for proper file upload
  const formData = new FormData();
  formData.append('', file); // Empty key name for Supabase

  const response = await fetch(\`\${SUPABASE_URL}/storage/v1/object/\${bucket}/\${filePath}\`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: \`Bearer \${token}\`,
      // Don't set Content-Type - browser will set it correctly with boundary
    },
    body: file, // Send file directly, not FormData
  });

  const data = await parseResponse<unknown>(response);
}
```

### Option 2: Remove Content-Type Header

In `src/lib/supabase/rest.ts`, change line 74:

```typescript
// REMOVE THIS:
"Content-Type": file.type || "application/octet-stream",

// The browser will automatically set the correct Content-Type
```

---

## 🧪 Test User ID

To verify the path is correct:

1. Add console.log in `src/lib/api/kyc.ts`:

```typescript
export async function submitKyc(payload: SubmitKycInput): Promise<KycRecord> {
  validateKycPayload(payload);
  const userId = await requireUserId();
  
  console.log("🔍 User ID:", userId);
  console.log("🔍 Document Path:", buildStoragePath(userId, payload.documentFile.name, now));
  console.log("🔍 Selfie Path:", buildStoragePath(userId, payload.selfieFile.name, now + 1));
  
  // ... rest of code
}
```

2. Check browser console for the logged paths
3. Verify format is: `abc-123-def/{timestamp}-{filename}`

---

## ✅ Quick Verification Checklist

- [ ] Supabase storage buckets exist (kyc-documents, kyc-selfies)
- [ ] RLS policies created (8 total: 4 per bucket)
- [ ] User is authenticated (auth.uid() returns non-null)
- [ ] File paths follow format: `{uuid}/{timestamp}-{filename}`
- [ ] File sizes within limits (5MB docs, 2MB selfies)
- [ ] MIME types match bucket restrictions
- [ ] Authorization header includes Bearer token
- [ ] Browser console shows actual error message

---

## 📋 Next Steps

1. **Check browser console** for exact error message
2. **Try manual upload** in Supabase Dashboard
3. **Add logging** to see exact paths being used
4. **Test RLS policies** with simple query in SQL Editor:

```sql
-- Test if RLS allows your user to upload
SELECT auth.uid()::text; -- Should return your user UUID

-- This should match the first folder in your path
SELECT (storage.foldername('abc-123-def/1234567890-test.jpg'))[1];
```

Share the exact error message from the browser console and I'll help fix it!
