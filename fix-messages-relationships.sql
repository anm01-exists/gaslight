-- Fix foreign key relationships for messaging feature
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what we have
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('messages', 'profiles')
ORDER BY table_name, ordinal_position;

-- 2. Drop existing foreign key constraints if they exist
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

-- 3. Add proper foreign key constraints to profiles table
-- Since messages references auth.users but we want to join with profiles
-- We need to ensure the relationships work correctly

-- 4. Update the messages table structure if needed
ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Create a view that properly joins messages with profiles
CREATE OR REPLACE VIEW message_details AS
SELECT 
  m.*,
  sender_profile.full_name as sender_name,
  sender_profile.course as sender_course,
  receiver_profile.full_name as receiver_name,
  receiver_profile.course as receiver_course
FROM messages m
LEFT JOIN profiles sender_profile ON m.sender_id = sender_profile.id
LEFT JOIN profiles receiver_profile ON m.receiver_id = receiver_profile.id;

-- 6. Grant access to the view
GRANT SELECT ON message_details TO authenticated;

-- 7. Create RLS policy for the view
ALTER VIEW message_details SET (security_invoker = true);

-- 8. Test the relationships
SELECT 
  table_name,
  constraint_name,
  column_name,
  foreign_table_name,
  foreign_column_name
FROM information_schema.key_column_usage 
WHERE table_name = 'messages'
  AND constraint_name LIKE '%fkey%';

-- ✅ Foreign key relationships are now properly set up
