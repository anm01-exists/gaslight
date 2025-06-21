-- Disable email confirmation for easier testing
-- Run this in your Supabase SQL Editor if you want to skip email confirmation during development

-- This allows users to sign up and immediately sign in without email confirmation
-- WARNING: Only use this for development/testing, not production

-- Check current auth settings
SELECT * FROM auth.config;

-- To disable email confirmation, go to:
-- https://supabase.com/dashboard/project/nvbabmklzfxpuguifhuq/auth/settings
-- 
-- And turn OFF "Enable email confirmations"
-- 
-- This allows immediate signup without email verification

-- Alternative: You can also set up SMTP properly if you want email confirmations to work
-- Go to: https://supabase.com/dashboard/project/nvbabmklzfxpuguifhuq/auth/settings
-- And configure SMTP settings with a real email provider
