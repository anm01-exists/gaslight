-- Fix RLS policies for StudyHub
-- Run this in your Supabase SQL Editor to fix the profile creation issue

-- 1. Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. Create more permissive policies that work with auth signup

-- Allow anyone to view profiles (needed for assignment browsing)
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own profile
-- This policy is more permissive during the signup process
CREATE POLICY "Enable insert for authenticated users based on user_id" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Alternatively, temporarily disable RLS for profiles during testing
-- Uncomment the line below if the above policies still don't work
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Ensure assignments policies are working correctly
DROP POLICY IF EXISTS "Assignments are viewable by everyone" ON assignments;
DROP POLICY IF EXISTS "Users can insert their own assignments" ON assignments;
DROP POLICY IF EXISTS "Users can update own assignments" ON assignments;
DROP POLICY IF EXISTS "Users can delete own assignments" ON assignments;

-- Recreate assignment policies
CREATE POLICY "Enable read access for all users" ON assignments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON assignments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON assignments
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Verify tables exist and have correct structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'assignments')
ORDER BY table_name, ordinal_position;
