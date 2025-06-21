-- Admin setup for StudyHub platform
-- Run this in your Supabase SQL Editor to enable admin functionality

-- 1. Add admin fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 2. Create admin_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- 'ban_user', 'verify_service', 'delete_content', etc.
  target_type TEXT NOT NULL, -- 'user', 'assignment', 'service', 'resource'
  target_id TEXT NOT NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create platform_settings table for admin configuration
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create content_reports table for user-reported content
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- 'assignment', 'service', 'resource', 'message', 'user'
  content_id TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'spam', 'inappropriate', 'fake', 'harassment', etc.
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES auth.users ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS for new tables
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for admin tables

-- Admin logs - only admins can view
CREATE POLICY "Admins can view admin logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert admin logs" ON admin_logs
  FOR INSERT WITH CHECK (
    auth.uid() = admin_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Platform settings - only admins can access
CREATE POLICY "Admins can view platform settings" ON platform_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update platform settings" ON platform_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Content reports - users can create, admins can view all
CREATE POLICY "Users can create content reports" ON content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON content_reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all content reports" ON content_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update content reports" ON content_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 7. Create admin functions

-- Function to make a user admin (only existing admins can do this)
CREATE OR REPLACE FUNCTION make_user_admin(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can grant admin privileges';
  END IF;

  -- Update target user
  UPDATE profiles 
  SET is_admin = true 
  WHERE id = target_user_id;

  -- Log the action
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, reason)
  VALUES (auth.uid(), 'grant_admin', 'user', target_user_id, 'Admin privileges granted');

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ban/unban users
CREATE OR REPLACE FUNCTION ban_user(target_user_id UUID, ban_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can ban users';
  END IF;

  -- Update target user
  UPDATE profiles 
  SET is_banned = true,
      admin_notes = ban_reason
  WHERE id = target_user_id;

  -- Log the action
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, reason)
  VALUES (auth.uid(), 'ban_user', 'user', target_user_id, ban_reason);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('max_assignment_budget', '50000', 'Maximum allowed assignment budget'),
('verification_required', 'true', 'Require verification for service providers'),
('auto_approve_resources', 'false', 'Auto-approve study resources from verified users')
ON CONFLICT (setting_key) DO NOTHING;

-- 9. Make the first user admin (replace with your email)
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';

-- 10. Create view for admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM assignments) as total_assignments,
  (SELECT COUNT(*) FROM service_providers) as total_services,
  (SELECT COUNT(*) FROM study_resources) as total_resources,
  (SELECT COUNT(*) FROM messages) as total_messages,
  (SELECT COUNT(*) FROM service_providers WHERE verified = false) as pending_verifications,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '7 days') as recent_signups,
  (SELECT COALESCE(SUM(total_earnings), 0) FROM profiles) as total_revenue;

-- Grant access to admin view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- ✅ Admin setup complete!
-- Remember to update the first admin user email in step 9
