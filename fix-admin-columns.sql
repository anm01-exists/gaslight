-- Fix: Add missing admin columns to profiles table
-- Run this in your Supabase SQL Editor

-- 1. Add the missing admin columns to profiles table
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false,
ADD COLUMN is_banned BOOLEAN DEFAULT false,
ADD COLUMN admin_notes TEXT,
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;

-- 2. Verify the columns were added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND column_name IN ('is_admin', 'is_banned', 'admin_notes', 'last_login_at')
ORDER BY column_name;

-- 3. Make yourself admin (REPLACE WITH YOUR EMAIL!)
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- 4. Verify admin user was created
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM profiles 
WHERE is_admin = true;

-- 5. Show final table structure
SELECT 
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
