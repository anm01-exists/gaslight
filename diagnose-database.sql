-- Comprehensive database diagnostic for StudyHub
-- Run this in your Supabase SQL Editor to identify the issue

-- 1. Check if profiles table exists
SELECT 
  schemaname, 
  tablename,
  tableowner 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. If profiles table exists, check its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if there are any users in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
LIMIT 5;

-- 4. Check if there are any profiles
SELECT 
  id,
  email,
  full_name,
  created_at
FROM profiles 
LIMIT 5;

-- 5. Check RLS policies on profiles table
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Check if current user has access to profiles
SELECT current_user, session_user;

-- 7. Test basic profile access
SELECT 'Testing basic profile access' as test;
SELECT COUNT(*) as profile_count FROM profiles;

-- 8. If profiles table doesn't exist, create it
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  course TEXT NOT NULL,
  year INTEGER NOT NULL,
  college TEXT NOT NULL,
  phone TEXT,
  rating DECIMAL DEFAULT 0,
  total_earnings DECIMAL DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  admin_notes TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 9. Enable RLS on profiles if it exists
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 10. Create basic RLS policies for profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 11. Check final table structure
SELECT 
  'Final check - profiles table structure:' as info;
  
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 12. Show any users who exist
SELECT 
  'Current users in the system:' as info;
  
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM profiles 
ORDER BY created_at 
LIMIT 10;
