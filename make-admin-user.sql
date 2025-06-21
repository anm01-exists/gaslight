-- Make a user admin for testing
-- Run this in your Supabase SQL Editor and replace the email with your actual email

-- Option 1: Make admin by email (replace with your email)
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Option 2: Make admin by user ID (if you know the user ID)
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = 'your-user-id-here';

-- Option 3: Make the first registered user admin
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM profiles ORDER BY created_at LIMIT 1);

-- Verify admin status
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = true;

-- If no admin exists, you can temporarily disable the check for testing:
-- (Uncomment the line below to disable admin checking temporarily)
-- UPDATE profiles SET is_admin = true WHERE email LIKE '%@%';
