-- Check profiles table structure and fix admin column issue
-- Run this in your Supabase SQL Editor

-- 1. Check if profiles table exists and what columns it has
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check if is_admin column exists specifically
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'is_admin';

-- 3. If is_admin column doesn't exist, add it
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 4. Also add other admin columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 5. Check current profiles
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
LIMIT 5;

-- 6. Make yourself admin (replace with your email)
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- 7. Verify the admin user was created
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;

-- If you see your email listed above, the fix worked!
